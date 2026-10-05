/* Cookie choice banner behaviour + the one place the visitor's choice is stored.
 *
 * Included on every page with <script src="/consent.js" defer>, BEFORE /analytics.js.
 * It only asks and remembers. /analytics.js decides what loads (see "CONSENT" there).
 *
 * The banner itself is plain HTML at the very top of every page (<div id="cc">), shown by a tiny
 * inline script in <head> (class "cc-wait" on <html>) BEFORE the first paint. It sits in the page
 * flow, so it never covers a button and never shifts the page. When opened again later from the
 * footer it floats (class "cc-pop") above the menu button.
 *
 *   Cookie  chabod_cc  = {"v":1,"a":1|0,"t":"<ISO time>"}   a:1 = Accept all, a:0 = Reject non-essential
 *   Kept 12 months. If the browser blocks cookies it falls back to localStorage (same key).
 *   Global Privacy Control (navigator.globalPrivacyControl) always counts as Reject, so no banner.
 *
 * window.chabodConsent.state()  ->  1 accepted | 0 rejected (or GPC) | null no choice yet
 * window.chabodConsent.open()   ->  show the banner again (footer "Cookie preferences")
 * document event "chabod-consent" fires on every new choice: detail { a, prev }
 */
(function () {
  "use strict";
  var KEY = "chabod_cc", D = document, H = D.documentElement, gpc = navigator.globalPrivacyControl === true;
  var box = D.getElementById("cc");

  function stored() {
    var s = null, m;
    try { m = D.cookie.match(/(?:^|; )chabod_cc=([^;]*)/); if (m) s = decodeURIComponent(m[1]); } catch (e) {}
    if (!s) try { s = localStorage.getItem(KEY); } catch (e) {}
    try { var o = JSON.parse(s); if (o && o.v === 1 && (o.a === 0 || o.a === 1)) return o; } catch (e) {}
    return null;
  }
  function state() { if (gpc) return 0; var o = stored(); return o ? o.a : null; }
  function save(a) {
    var s = JSON.stringify({ v: 1, a: a, t: new Date().toISOString() });
    try { D.cookie = KEY + "=" + encodeURIComponent(s) + "; Max-Age=31536000; Path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : ""); } catch (e) {}
    if (!/(?:^|; )chabod_cc=/.test(D.cookie)) try { localStorage.setItem(KEY, s); } catch (e) {}
  }

  function hide() { box.hidden = true; box.className = ""; H.className = H.className.replace(/\s*\bcc-wait\b/, ""); }
  function choose(a) {
    hide();
    if (a !== 1 && a !== 0) return; // the OK button on the Global Privacy Control notice
    var prev = state();
    if (!gpc) save(a);
    D.dispatchEvent(new CustomEvent("chabod-consent", { detail: { a: a, prev: prev } }));
  }

  function open() {
    if (!box) return;
    if (/\bcc-wait\b/.test(H.className) && !box.hidden) { box.scrollIntoView(); }   // first-time banner is already showing at the top
    else {
      if (gpc) box.innerHTML = '<p>Your browser is sending Global Privacy Control, so we treat that as \u201CReject non-essential\u201D and keep the ad and recording tools off. See our <a href="/privacy-policy#cookies">Privacy Policy</a>.</p><div class="b"><button type="button" data-a="x">OK</button></div>';
      box.hidden = false; box.className = "cc-pop";
    }
    var b = box.querySelector("button"); if (b) b.focus();
  }

  if (box) {
    box.addEventListener("click", function (e) {
      var a = e.target.getAttribute && e.target.getAttribute("data-a");
      if (a !== null && a !== undefined) choose(+a);
    });
    D.addEventListener("keydown", function (e) { if (e.key === "Escape" && !box.hidden && state() !== null) hide(); });
    // Already chosen (or GPC): the banner stays hidden. No choice: it is already showing (see <head>).
    if (gpc || stored() !== null) { box.hidden = true; H.className = H.className.replace(/\s*\bcc-wait\b/, ""); }
    else { box.hidden = false; if (!/\bcc-wait\b/.test(H.className)) H.className += " cc-wait"; }
  }

  window.chabodConsent = { state: state, open: open, gpc: gpc };

  D.addEventListener("click", function (e) {
    var l = e.target.closest && e.target.closest("[data-cc-open]");
    if (l) { e.preventDefault(); open(); }
  });
})();
