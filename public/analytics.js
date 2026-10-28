/* Shared analytics loader for the whole site.
 *
 *   Google Analytics 4   G-W2673C88JM   (the only Measurement ID for this site)
 *   Microsoft Clarity    ysa4js5f6n     (session recordings; only after "Accept all")
 *   Meta Pixel           578421348357572 (only after "Accept all"; it is NOT in any page any more)
 *   GoHighLevel tracking tk_7f60d9dc4ed14bbeb923fbe8d285400b (only after "Accept all", loaded last, ~84 KB)
 *
 * ONE file, included on every page with <script src="/analytics.js" defer>, after /consent.js.
 * To switch ALL of it off, set ENABLED to false below (or empty this file): one edit.
 *
 * CONSENT (the visitor's choice comes from /consent.js, cookie chabod_cc):
 *   no choice yet     Google Analytics only, with Google's ad storage / ad signals switched OFF.
 *                     Set GATE_GA4 = true to make even that wait for "Accept all".
 *   Accept all        Google Analytics + Microsoft Clarity + Meta Pixel + GoHighLevel tracking.
 *   Reject / GPC      Nothing loads. Our own analytics cookies are deleted (_ga*, _fbp, _fbc,
 *                     _clck, _clsk) and Meta's / Clarity's browser storage is cleared.
 *   Changing from Accept to Reject reloads the page so nothing keeps running.
 *
 * Speed rules this file follows:
 *   - It is deferred, tiny, and does nothing at parse time except queue a few calls.
 *   - Nothing from Google, Microsoft or Meta is requested until a visitor actually
 *     interacts (scroll, touch, key, mouse), or 5 seconds after the page has
 *     loaded, whichever comes first, and then only when the browser is idle. A tap
 *     on Call / Text / the menu or a form submit starts it at once. Clicking "Accept all"
 *     starts everything at once. So it never competes with the hero image, fonts, first
 *     paint or a lab speed test.
 *   - Events fired before gtag.js arrives are queued in dataLayer and sent later.
 *   - Trade-off to know about: a visitor who leaves within ~5 seconds without
 *     touching anything is not counted.
 *
 * Privacy rules this file follows:
 *   - No names, phone numbers or email addresses are ever sent. Form events carry
 *     the page path and where the form is, never what was typed.
 *   - The Meta Pixel runs with its automatic matching and automatic button/form
 *     detection switched off in code (autoConfig false) as well as in Meta's settings.
 *   - Query strings are scrubbed before the page address is reported (e.g. the
 *     owner's ?preview= key, or anything that looks like an email or phone).
 *   - Admin pages, previews, localhost and *.workers.dev are never counted.
 */
(function () {
  "use strict";

  var ENABLED = true;
  var GA4_ID = "G-W2673C88JM";
  var GATE_GA4 = false;          // true: even Google Analytics waits for "Accept all"
  var META_ENABLED = true;
  var META_ID = "578421348357572";
  var GHL_ENABLED = true;        // GoHighLevel tracking (ties visits and form fills to contacts); only after "Accept all"
  var GHL_ID = "tk_7f60d9dc4ed14bbeb923fbe8d285400b";

  if (!ENABLED) return;

  /* ---- only count real visits to the live site ---- */
  var host = location.hostname;
  if (host !== "chabodcleaningservices.com" && host !== "www.chabodcleaningservices.com") return;
  if (location.pathname.indexOf("/admin/") === 0) return;
  if (/[?&]preview=/.test(location.search)) return;

  /* ---- the visitor's choice ---- */
  var CC = window.chabodConsent || { state: function () { return null; } };
  function choice() { return CC.state(); }                        // 1 accepted | 0 rejected/GPC | null none
  function gaAllowed() { var c = choice(); return c === 1 || (c === null && !GATE_GA4); }
  var blocked = false;                                            // set when the visitor rejects on this page

  /* Remove what a rejected visitor must not keep: our side of the analytics cookies, and the
   * browser storage Meta and Clarity use. (Cookies those companies set on THEIR OWN domains can
   * only be removed from the browser's settings; the Privacy Policy says so.) */
  var KILL = /^(_ga|_ga_.+|_gid|_gat.*|_fbp|_fbc|_clck|_clsk|lc_session_.+)$/;
  function cleanup() {
    try {
      var names = document.cookie.split(";");
      var doms = ["", location.hostname, "." + location.hostname, ".chabodcleaningservices.com"];
      for (var i = 0; i < names.length; i++) {
        var n = names[i].split("=")[0].replace(/^\s+/, "");
        if (!KILL.test(n)) continue;
        for (var j = 0; j < doms.length; j++) document.cookie = n + "=; Max-Age=0; Path=/" + (doms[j] ? "; Domain=" + doms[j] : "");
      }
    } catch (e) {}
    try {
      localStorage.removeItem("lastExternalReferrer");
      localStorage.removeItem("lastExternalReferrerTime");
      sessionStorage.removeItem("_cltk");
    } catch (e) {}
  }

  /* ---- the address we report: query string scrubbed ---- */
  var DROP_PARAMS = /^(preview|key|token|code|state|email|e-mail|phone|tel|name|first_?name|last_?name|password)$/i;
  var LOOKS_PERSONAL = /@|(\d[\s().-]*){7,}/;
  function cleanUrl() {
    try {
      var u = new URL(location.href);
      var keys = [];
      u.searchParams.forEach(function (v, k) { keys.push([k, v]); });
      for (var i = 0; i < keys.length; i++) {
        if (DROP_PARAMS.test(keys[i][0]) || LOOKS_PERSONAL.test(keys[i][1])) u.searchParams.delete(keys[i][0]);
      }
      return u.origin + u.pathname + (u.searchParams.toString() ? "?" + u.searchParams.toString() : "");
    } catch (e) {
      return location.origin + location.pathname;
    }
  }

  /* ---- Google Analytics 4 ---- */
  function gtag() { window.dataLayer.push(arguments); }
  var gaReady = false;
  function setupGA() {
    if (gaReady) return;
    gaReady = true;
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) window.gtag = gtag;
    // Google's ad features stay OFF in every state; only visit counting is ever on.
    gtag("consent", "default", {
      ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
      analytics_storage: gaAllowed() ? "granted" : "denied"
    });
    gtag("js", new Date());
    gtag("config", GA4_ID, {
      page_location: cleanUrl(),
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  function loadGtag() {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_ID);
    document.head.appendChild(s);
    return s;
  }

  /* ---- WHEN the tags load ----
   * Google's tag costs real main-thread time (measured: about +190ms of blocking time and
   * -6 PageSpeed points when it runs in the seconds right after load). Lab speed tests never
   * touch the page, so the tags wait for an actual visitor: the first scroll, touch, key press
   * or mouse move, then run during an idle moment. A timer is the fallback for people who just
   * read. A tap on Call / Text / the menu, or a form submit, starts them immediately so a
   * conversion is never lost. Everything queued meanwhile is delivered once the tag arrives. */
  var MAX_WAIT_MS = 5000;   // after the page has loaded, at most this long with no interaction
  var TRIGGERS = ["scroll", "touchstart", "pointerdown", "mousemove", "keydown"];
  var gtagStarted = false;
  var restStarted = false;
  var tagsScheduled = false;

  function startTags() {
    if (blocked || !gaAllowed()) return;
    setupGA();
    if (!gtagStarted) {
      gtagStarted = true;
      var g = loadGtag();
      afterGtag(g, startRest);
    }
  }
  // Clarity + Meta Pixel: only for visitors who chose "Accept all".
  function startRest() {
    if (restStarted || blocked || choice() !== 1) return;
    restStarted = true;
    loadClarity();
    loadMeta();
    setTimeout(loadGhl, 1500);   // last in line: it is the biggest of the three
  }
  function scheduleTags() {
    if (tagsScheduled) return;
    tagsScheduled = true;
    if (window.requestIdleCallback) window.requestIdleCallback(startTags, { timeout: 2500 });
    else setTimeout(startTags, 300);
  }
  function afterLoad(fn) {
    if (document.readyState === "complete") fn();
    else window.addEventListener("load", fn);
  }
  function onFirstInteraction() {
    for (var i = 0; i < TRIGGERS.length; i++) window.removeEventListener(TRIGGERS[i], onFirstInteraction);
    afterLoad(scheduleTags);
  }

  /* ---- Microsoft Clarity (session recordings + heatmaps) ----
   * Loads strictly AFTER Google Analytics has finished loading (or failed, or 4s have
   * passed), so the two never compete with each other or with the page.
   * Turn it off on its own with CLARITY_ENABLED = false. */
  var CLARITY_ENABLED = true;
  var CLARITY_ID = "ysa4js5f6n";

  // Belt and braces: whatever masking mode the Clarity dashboard is set to, every form
  // field on the site is marked as masked, so typed names, phones and emails are never
  // readable in a recording. Also catches fields added to the page later.
  var FIELD_SELECTOR = "input, textarea, select, form";
  function maskFields(root) {
    var list = root.querySelectorAll ? root.querySelectorAll(FIELD_SELECTOR) : [];
    for (var i = 0; i < list.length; i++) list[i].setAttribute("data-clarity-mask", "True");
    if (root.matches && root.matches(FIELD_SELECTOR)) root.setAttribute("data-clarity-mask", "True");
  }
  function loadClarity() {
    if (!CLARITY_ENABLED || window.clarity) return;
    maskFields(document);
    if (window.MutationObserver) {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var added = muts[i].addedNodes;
          for (var j = 0; j < added.length; j++) if (added[j].nodeType === 1) maskFields(added[j]);
        }
      }).observe(document.documentElement, { childList: true, subtree: true });
    }
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }
  function afterGtag(gtagScript, fn) {
    var done = false;
    function go() {
      if (done) return;
      done = true;
      if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout: 3000 });
      else setTimeout(fn, 500);
    }
    gtagScript.addEventListener("load", go);
    gtagScript.addEventListener("error", go);
    setTimeout(go, 4000); // never wait on Google forever
  }


  /* ---- Meta Pixel (Facebook / Instagram ad measurement) ----
   * Not in any page's HTML any more, and there is no <noscript> image: it loads here and
   * only after "Accept all". autoConfig false (set BEFORE init) turns off Meta's automatic
   * advanced matching and its automatic button / form detection, so no name, phone or email
   * (hashed or not) and no form-field details are ever sent. Only PageView, plus the Lead
   * event the fee-calculator form fires itself (page-level info only, no identifiers). */
  function loadMeta() {
    if (!META_ENABLED || window.fbq) return;
    (function (f, b, e, v, n, t, s) {
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("set", "autoConfig", false, META_ID);
    window.fbq("init", META_ID);
    window.fbq("track", "PageView");
  }

  /* ---- GoHighLevel external tracking ----
   * Records visits, clicks and form submissions so GHL can tie them to contacts. Loaded only after
   * "Accept all", and after Clarity and the Pixel, so it never competes with the page. */
  function loadGhl() {
    if (!GHL_ENABLED || blocked || choice() !== 1 || document.getElementById("ghl-tracking")) return;
    var s = document.createElement("script");
    s.id = "ghl-tracking"; s.async = true; s.src = "https://link.msgsndr.com/js/external-tracking.js";
    s.setAttribute("data-tracking-id", GHL_ID);
    document.head.appendChild(s);
  }

  /* ---- start-up and later changes of mind ---- */
  if (choice() === 0) {
    cleanup();   // rejected, or Global Privacy Control: nothing loads on this page
  } else if (gaAllowed()) {
    setupGA();
    for (var t = 0; t < TRIGGERS.length; t++) window.addEventListener(TRIGGERS[t], onFirstInteraction, { passive: true });
    afterLoad(function () { setTimeout(scheduleTags, MAX_WAIT_MS); });
  }
  // Accepted earlier: Clarity and the Pixel start with the normal idle-time sequence above (startRest).

  document.addEventListener("chabod-consent", function (e) {
    var d = e.detail || {};
    if (d.a === 1) {
      blocked = false;
      window["ga-disable-" + GA4_ID] = false;
      setupGA();
      if (window.gtag && gaReady) gtag("consent", "update", { analytics_storage: "granted" });
      if (gtagStarted) startRest(); else startTags();   // user just acted: do not wait for idle time
    } else {
      blocked = true;
      window["ga-disable-" + GA4_ID] = true;
      if (gaReady) gtag("consent", "update", { analytics_storage: "denied" });
      cleanup();
      if (d.prev === 1) location.reload();               // Clarity / Pixel were running: start clean
    }
  });

  /* ---- custom events ---- */
  // Where on the page something happened, as a stable label. First match wins.
  var PLACES = [
    [".fab-nav", "fab_menu"],
    ["#chabod-fee-calc-root", "fee_calculator"],
    [".site-footer", "footer"],
    [".logo-bar", "header"],
    [".hero, .hero-parallax, .hero-overlay, .hero-visual", "hero"],
    [".final-text", "final_cta"],
    [".pricing", "pricing"],
    [".mid-cta", "mid_page_cta"],
    [".reframe", "reframe"],
    [".journey-cta", "journey_cta"],
    [".blog-cta", "blog_cta"],
    [".article-body", "blog_post"],
    [".notfound-body", "not_found"],
    [".legal-body", "legal_text"]
  ];
  function where(el) {
    for (var i = 0; i < PLACES.length; i++) {
      if (el.closest(PLACES[i][0])) return PLACES[i][1];
    }
    return "page";
  }

  // Button text, with anything phone-shaped masked so no number is ever a parameter.
  function label(el) {
    return (el.textContent || "")
      .replace(/\s+/g, " ")
      .replace(/\(?\d{3}\)?[\s.-]*\d{3}[\s.-]*\d{4}/g, "[phone]")
      .trim()
      .slice(0, 40);
  }

  function track(name, params) {
    // NB: not called "page_path": Google treats that name as one of its own built-ins and
    // drops it from custom event parameters.
    if (blocked || !gaReady) return; // rejected, or Google Analytics is waiting for a choice
    params.page_url_path = location.pathname;
    gtag("event", name, params);
    startTags(); // a conversion: do not wait for idle or the timer
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var a = t.closest("a[href]");
    if (a) {
      var href = a.getAttribute("href") || "";
      if (/^tel:/i.test(href)) { track("call_click", { button_location: where(a), cta_text: label(a) }); return; }
      if (/^sms:/i.test(href)) { track("text_click", { button_location: where(a), cta_text: label(a) }); return; }
    }

    // Menu button: the page's own handler has already toggled it, so count opens only.
    var fab = t.closest(".fab-button");
    if (fab) {
      var nav = fab.closest(".fab-nav");
      if (nav && nav.classList.contains("open")) track("menu_open", { button_location: "fab_menu" });
    }
  });

  // Quote form (Formspree). Only that it was submitted, never what was typed.
  document.addEventListener("submit", function (e) {
    var f = e.target;
    if (!f || f.tagName !== "FORM") return;
    var act = f.getAttribute("action") || "";
    if (act.indexOf("formspree.io") === -1 && act.indexOf("services.leadconnectorhq.com") === -1) return;
    track("form_submit", { form_id: f.id || "quote_form", button_location: where(f) });
  }, true);
  // Click-to-play video poster tapped (the pages dispatch this). Which video and where, nothing else.
  document.addEventListener("chabod-video-play", function (e) {
    track("video_play", { video_id: (e.detail && e.detail.id) || "", button_location: where(e.target) });
  });
})();
