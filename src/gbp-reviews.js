// ---- Google Business Profile reviews ----
//
// Pulls the real star rating, review count and review text for the Chabod
// listing and serves them to the site as JSON at /api/reviews.
//
// Shape of the thing:
//   - Page loads never call Google. They read a cached copy out of KV, so the
//     API can be slow or down without anyone on the site noticing.
//   - A cron trigger refreshes that cache every 6 hours.
//   - The refresh token is written to KV by the OAuth callback and is never
//     displayed, logged, or sent to the browser.
//   - Client id/secret and the admin key live in Worker secrets.
//
// Credentials needed (set with `wrangler secret put <NAME>`):
//   GBP_CLIENT_ID, GBP_CLIENT_SECRET, GBP_ADMIN_KEY
//
// KV keys (stored in the BLOG_POSTS namespace under a gbp: prefix — the
// account's API token can't create new namespaces):
//   gbp:refresh_token   the long-lived Google refresh token
//   gbp:location        resolved "accounts/{id}/locations/{id}"
//   gbp:cache           the public payload + fetchedAt
//   gbp:last_error      last failure, for /admin/gbp/status
//   gbp:state:<state>   short-lived CSRF value for the OAuth round trip

const SCOPE = "https://www.googleapis.com/auth/business.manage";
const REDIRECT_PATH = "/admin/gbp/callback";
const CACHE_TTL_SECONDS = 6 * 60 * 60; // refresh cadence
const SERVE_STALE_SECONDS = 7 * 24 * 60 * 60; // keep showing old data this long if refreshes fail
const MAX_REVIEWS = 6;
const MAX_REVIEW_CHARS = 320;

// The existing static link, used as the fallback everywhere.
const PROFILE_URL = "https://www.google.com/maps/place/?q=place_id:ChIJ2_gm6Y1nXIYRicrHNpNz2sM";
// Chabod Cleaning Services' own Google place id (the one in PROFILE_URL). Used to
// pick the right profile when the Google user manages several.
const CHABOD_PLACE_ID = "ChIJ2_gm6Y1nXIYRicrHNpNz2sM";

const STAR_WORDS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

const K = {
  token: "gbp:refresh_token",
  location: "gbp:location",
  cache: "gbp:cache",
  error: "gbp:last_error",
  seen: "gbp:locations_seen", // every location the Google user can see, for diagnosing a bad match
  state: (s) => `gbp:state:${s}`,
};

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=900",
      ...extraHeaders,
    },
  });
}

function page(title, lines) {
  const body = lines.map((l) => `<p>${l}</p>`).join("\n");
  return new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">` +
      `<meta name="robots" content="noindex"><title>${title}</title>` +
      `<style>body{font:15px/1.6 system-ui,sans-serif;max-width:46rem;margin:3rem auto;padding:0 1.25rem;color:#23262b}` +
      `h1{font-size:20px}code{background:#f1f1f4;padding:1px 5px;border-radius:4px;word-break:break-all}` +
      `.ok{color:#17733f}.bad{color:#b3261e}</style></head><body><h1>${title}</h1>${body}</body></html>`,
    { status: 200, headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "noindex" } }
  );
}

// Constant-time-ish compare so the admin key can't be guessed byte by byte.
export function safeEqual(a = "", b = "") {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function adminOk(url, env) {
  const key = url.searchParams.get("key");
  return Boolean(env.GBP_ADMIN_KEY) && safeEqual(key || "", env.GBP_ADMIN_KEY);
}

function configured(env) {
  return Boolean(env.GBP_CLIENT_ID && env.GBP_CLIENT_SECRET && env.GBP_ADMIN_KEY);
}

// ---- OAuth ---------------------------------------------------------------

async function startAuth(url, env) {
  const state = crypto.randomUUID();
  await env.BLOG_POSTS.put(K.state(state), "1", { expirationTtl: 600 });
  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.searchParams.set("client_id", env.GBP_CLIENT_ID);
  auth.searchParams.set("redirect_uri", `${url.origin}${REDIRECT_PATH}`);
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("scope", SCOPE);
  auth.searchParams.set("access_type", "offline");
  auth.searchParams.set("prompt", "consent"); // force a refresh token every time
  auth.searchParams.set("state", state);
  return Response.redirect(auth.toString(), 302);
}

async function exchangeCode(env, origin, code) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: env.GBP_CLIENT_ID,
      client_secret: env.GBP_CLIENT_SECRET,
      redirect_uri: `${origin}${REDIRECT_PATH}`,
      grant_type: "authorization_code",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`token exchange failed (${res.status}): ${data.error_description || data.error || "unknown"}`);
  return data;
}

async function accessToken(env) {
  const refresh = await env.BLOG_POSTS.get(K.token);
  if (!refresh) throw new Error("not authorized yet — no refresh token stored");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refresh,
      client_id: env.GBP_CLIENT_ID,
      client_secret: env.GBP_CLIENT_SECRET,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // invalid_grant = the refresh token was revoked or expired (the classic
    // symptom of leaving the consent screen in Testing mode).
    throw new Error(`refresh failed (${res.status}): ${data.error_description || data.error || "unknown"}`);
  }
  return data.access_token;
}

// ---- Business Profile API ------------------------------------------------

async function api(token, endpoint) {
  const res = await fetch(endpoint, { headers: { authorization: `Bearer ${token}` } });
  const text = await res.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { /* non-JSON error body */ }
  if (!res.ok) {
    const err = data.error || {};
    const detail = err.message || text.slice(0, 300) || res.statusText;
    // Google returns an activation URL when the API simply isn't switched on.
    const activate = (err.details || [])
      .flatMap((d) => (d.metadata && d.metadata.activationUrl ? [d.metadata.activationUrl] : []))
      .concat(/activat\w+ url|enable it by visiting/i.test(detail) ? [(detail.match(/https?:\/\/\S+/) || [""])[0]] : [])
      .filter(Boolean);
    const e = new Error(`${endpoint.split("/")[2]} ${res.status}: ${detail}`);
    e.activationUrl = activate[0] || null;
    e.status = res.status;
    throw e;
  }
  return data;
}

// Every location the authorized Google user can see, across all accounts.
async function listAllLocations(token) {
  const accounts = [];
  let pageToken = "";
  do {
    const r = await api(token, "https://mybusinessaccountmanagement.googleapis.com/v1/accounts?pageSize=20" + (pageToken ? "&pageToken=" + encodeURIComponent(pageToken) : ""));
    accounts.push(...(r.accounts || []));
    pageToken = r.nextPageToken || "";
  } while (pageToken);

  const out = [];
  for (const account of accounts) {
    let pt = "";
    try {
      do {
        const r = await api(
          token,
          `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,metadata&pageSize=100` +
            (pt ? "&pageToken=" + encodeURIComponent(pt) : "")
        );
        for (const loc of r.locations || []) {
          out.push({
            account: account.name,
            accountName: account.accountName || "",
            name: loc.name,
            title: loc.title || "",
            placeId: (loc.metadata && loc.metadata.placeId) || "",
          });
        }
        pt = r.nextPageToken || "";
      } while (pt);
    } catch (e) {
      out.push({ account: account.name, accountName: account.accountName || "", error: String(e.message || e).slice(0, 200) });
    }
  }
  return out;
}

// "accounts/123/locations/456" for CHABOD'S profile, resolved once and remembered.
// Matches by Google place id, then by a title containing "Chabod". If that does
// not identify exactly one location it throws instead of guessing: showing the
// wrong business's reviews is far worse than showing none.
async function resolveLocation(env, token) {
  const cached = await env.BLOG_POSTS.get(K.location);
  if (cached) return cached;

  const all = await listAllLocations(token);
  await env.BLOG_POSTS.put(K.seen, JSON.stringify({ at: new Date().toISOString(), locations: all }));

  const real = all.filter((l) => l.name);
  let match = real.filter((l) => l.placeId === CHABOD_PLACE_ID);
  if (match.length === 0) match = real.filter((l) => /chabod/i.test(l.title));

  if (match.length === 0) {
    const titles = real.map((l) => `"${l.title || l.name}"`).join(", ") || "none";
    throw new Error(`Chabod's Business Profile is not among the ${real.length} location(s) this Google user manages (${titles}). Authorize with the Google account that owns the Chabod profile.`);
  }
  if (match.length > 1) {
    throw new Error(`${match.length} locations match Chabod (${match.map((l) => l.name).join(", ")}); refusing to guess.`);
  }

  const full = `${match[0].account}/${match[0].name}`;
  await env.BLOG_POSTS.put(K.location, full);
  return full;
}

function cleanText(s = "") {
  return s.replace(/\s+/g, " ").trim();
}

// For non-English reviews Google appends "(Translated by Google) <English>" to the
// original text. Keep what the customer actually wrote.
function stripTranslation(s = "") {
  const i = s.indexOf("(Translated by Google)");
  return i > 0 ? s.slice(0, i) : s;
}

// Google hands back full display names. Show "Maria G." instead — the reviews
// are public either way, but there's no reason to republish full names.
function abbreviateName(name) {
  const parts = cleanText(name).split(" ").filter(Boolean);
  if (!parts.length) return "A Google user";
  if (parts.length === 1) return parts[0];
  const last = parts[parts.length - 1];
  return `${parts[0]} ${last[0].toUpperCase()}.`;
}

function trim(text) {
  const t = cleanText(text);
  if (t.length <= MAX_REVIEW_CHARS) return { text: t, truncated: false };
  const cut = t.slice(0, MAX_REVIEW_CHARS);
  const at = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" "));
  return { text: cut.slice(0, at > 180 ? at : MAX_REVIEW_CHARS).trim() + "…", truncated: true };
}

// Reviews still live on the older v4 surface; they were never moved to the
// split v1 APIs.
async function fetchReviews(env, token) {
  const location = await resolveLocation(env, token);
  const data = await api(
    token,
    `https://mybusiness.googleapis.com/v4/${location}/reviews?orderBy=updateTime%20desc&pageSize=50`
  );

  const all = data.reviews || [];
  const reviews = all
    .filter((r) => cleanText(r.comment || "").length > 0)
    .map((r) => {
      const { text, truncated } = trim(stripTranslation(r.comment));
      return {
        author: abbreviateName((r.reviewer && r.reviewer.displayName) || ""),
        rating: STAR_WORDS[r.starRating] || null,
        text,
        truncated,
        date: (r.createTime || r.updateTime || "").slice(0, 10),
      };
    })
    .filter((r) => r.rating !== null)
    .sort((a, b) => (b.rating - a.rating) || (b.date < a.date ? -1 : 1))
    .slice(0, MAX_REVIEWS);

  const rating = typeof data.averageRating === "number" ? Math.round(data.averageRating * 10) / 10 : null;
  const total = typeof data.totalReviewCount === "number" ? data.totalReviewCount : all.length || null;

  return {
    ok: true,
    rating,
    total,
    reviews,
    profileUrl: PROFILE_URL,
    fetchedAt: new Date().toISOString(),
  };
}

async function refreshCache(env) {
  try {
    const token = await accessToken(env);
    const payload = await fetchReviews(env, token);
    await env.BLOG_POSTS.put(K.cache, JSON.stringify(payload));
    await env.BLOG_POSTS.delete(K.error);
    return payload;
  } catch (err) {
    await env.BLOG_POSTS.put(
      K.error,
      JSON.stringify({ at: new Date().toISOString(), message: String(err.message || err), activationUrl: err.activationUrl || null })
    );
    throw err;
  }
}

// ---- public + admin routes ----------------------------------------------

async function serveReviews(env) {
  // Never calls Google inline: a cold or failing API must not slow a page load.
  const raw = await env.BLOG_POSTS.get(K.cache);
  if (!raw) return json({ ok: false, reason: "no-data", profileUrl: PROFILE_URL }, 200, { "cache-control": "public, max-age=300" });

  let data;
  try { data = JSON.parse(raw); } catch { return json({ ok: false, reason: "bad-cache", profileUrl: PROFILE_URL }); }

  const ageSeconds = (Date.now() - Date.parse(data.fetchedAt || 0)) / 1000;
  if (!(ageSeconds < SERVE_STALE_SECONDS)) {
    // Too old to stand behind — let the page fall back to the plain link.
    return json({ ok: false, reason: "stale", profileUrl: PROFILE_URL });
  }
  return json({ ...data, stale: ageSeconds > CACHE_TTL_SECONDS * 1.5 });
}

export async function handleGbp(request, url, env, ctx) {
  // public feed
  if (url.pathname === "/api/reviews") {
    if (request.method !== "GET") return json({ ok: false, reason: "method" }, 405);
    return serveReviews(env);
  }

  if (!url.pathname.startsWith("/admin/gbp/")) return null;

  // Everything below is operator-only and must never be indexed. Before the
  // secrets exist there is no key to check against, so these paths simply do
  // not exist as far as the outside world is concerned.
  if (!configured(env)) return new Response("Not found", { status: 404 });

  if (url.pathname === REDIRECT_PATH) {
    const err = url.searchParams.get("error");
    if (err) return page("Authorization cancelled", [`<span class="bad">Google returned: <code>${err}</code></span>`, "Nothing was saved. You can try again."]);

    const state = url.searchParams.get("state") || "";
    const known = state && (await env.BLOG_POSTS.get(K.state(state)));
    if (!known) return page("Authorization failed", ['<span class="bad">That link expired or was not started here.</span>', "Start again from <code>/admin/gbp/start</code>."]);
    await env.BLOG_POSTS.delete(K.state(state));

    const code = url.searchParams.get("code");
    if (!code) return page("Authorization failed", ['<span class="bad">No authorization code came back.</span>']);

    try {
      const tokens = await exchangeCode(env, url.origin, code);
      if (!tokens.refresh_token) {
        return page("Almost — no refresh token", [
          '<span class="bad">Google did not return a refresh token.</span>',
          "That happens when this account already granted access before. Remove the app at " +
            "<code>myaccount.google.com/permissions</code>, then run the start link again.",
        ]);
      }
      await env.BLOG_POSTS.put(K.token, tokens.refresh_token);
      await env.BLOG_POSTS.delete(K.location);
    } catch (e) {
      return page("Authorization failed", [`<span class="bad">${String(e.message || e)}</span>`]);
    }

    // Prove it end to end straight away.
    try {
      const data = await refreshCache(env);
      return page("Connected", [
        '<span class="ok">Authorization saved and reviews fetched.</span>',
        `Rating: <strong>${data.rating ?? "—"}</strong> from <strong>${data.total ?? "—"}</strong> reviews; ${data.reviews.length} with text.`,
        "The site will refresh this automatically every 6 hours. You can close this tab.",
      ]);
    } catch (e) {
      const extra = e.activationUrl
        ? `Enable the API here, wait a minute, then reload this page: <code>${e.activationUrl}</code>`
        : "Check <code>/admin/gbp/status</code> for details.";
      return page("Authorized, but the review fetch failed", [
        '<span class="ok">The Google sign-in worked and the token is saved.</span>',
        `<span class="bad">${String(e.message || e)}</span>`,
        extra,
      ]);
    }
  }

  if (!adminOk(url, env)) return new Response("Not found", { status: 404 });

  if (url.pathname === "/admin/gbp/start") return startAuth(url, env);

  if (url.pathname === "/admin/gbp/refresh") {
    try {
      const data = await refreshCache(env);
      return json({ ok: true, rating: data.rating, total: data.total, withText: data.reviews.length, fetchedAt: data.fetchedAt });
    } catch (e) {
      return json({ ok: false, error: String(e.message || e), activationUrl: e.activationUrl || null }, 200);
    }
  }

  if (url.pathname === "/admin/gbp/status") {
    const [hasToken, location, raw, lastError] = await Promise.all([
      env.BLOG_POSTS.get(K.token).then(Boolean),
      env.BLOG_POSTS.get(K.location),
      env.BLOG_POSTS.get(K.cache),
      env.BLOG_POSTS.get(K.error),
    ]);
    let cache = null;
    if (raw) {
      try {
        const d = JSON.parse(raw);
        cache = {
          rating: d.rating,
          total: d.total,
          withText: (d.reviews || []).length,
          fetchedAt: d.fetchedAt,
          ageHours: Math.round(((Date.now() - Date.parse(d.fetchedAt)) / 36e5) * 10) / 10,
        };
      } catch { cache = { error: "unparseable" }; }
    }
    return json({
      authorized: hasToken, // never the token itself
      location: location || null,
      cache,
      lastError: lastError ? JSON.parse(lastError) : null,
      refreshEveryHours: CACHE_TTL_SECONDS / 3600,
    });
  }

  if (url.pathname === "/admin/gbp/disconnect") {
    await Promise.all([env.BLOG_POSTS.delete(K.token), env.BLOG_POSTS.delete(K.cache), env.BLOG_POSTS.delete(K.location)]);
    return page("Disconnected", ["Stored token and cached reviews deleted. The site is back to the plain Google link."]);
  }

  return new Response("Not found", { status: 404 });
}

export async function scheduledGbpRefresh(env) {
  if (!configured(env)) return;
  const hasToken = await env.BLOG_POSTS.get(K.token);
  if (!hasToken) return; // not connected yet; nothing to do
  try {
    await refreshCache(env);
  } catch {
    // Already recorded in gbp:last_error. The cached copy keeps serving.
  }
}
