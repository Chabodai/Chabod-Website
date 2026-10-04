/* Shared analytics loader for the whole site.
 *
 *   Google Analytics 4   G-W2673C88JM   (the only Measurement ID for this site)
 *
 * ONE file, included on every page with <script src="/analytics.js" defer>.
 * To switch ALL analytics off, set ENABLED to false below (or empty this file):
 * one edit, no page has to change.
 *
 * Speed rules this file follows:
 *   - It is deferred, tiny, and does nothing at parse time except queue a few calls.
 *   - Google's gtag.js is requested only AFTER the page's load event, once the
 *     browser is idle (requestIdleCallback), so it never competes with the hero
 *     image, fonts or the first paint.
 *   - Events fired before gtag.js arrives are queued in dataLayer and sent later.
 *
 * Privacy rules this file follows:
 *   - No names, phone numbers or email addresses are ever sent. Form events carry
 *     the page path and where the form is, never what was typed.
 *   - Query strings are scrubbed before the page address is reported (e.g. the
 *     owner's ?preview= key, or anything that looks like an email or phone).
 *   - Admin pages, previews, localhost and *.workers.dev are never counted.
 */
(function () {
  "use strict";

  var ENABLED = true;
  var GA4_ID = "G-W2673C88JM";

  if (!ENABLED) return;

  /* ---- only count real visits to the live site ---- */
  var host = location.hostname;
  if (host !== "chabodcleaningservices.com" && host !== "www.chabodcleaningservices.com") return;
  if (location.pathname.indexOf("/admin/") === 0) return;
  if (/[?&]preview=/.test(location.search)) return;

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
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  if (!window.gtag) window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA4_ID, {
    page_location: cleanUrl(),
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  function loadGtag() {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_ID);
    document.head.appendChild(s);
  }

  // After the page has loaded AND the browser has a quiet moment.
  function afterPaint(fn) {
    function go() {
      if (window.requestIdleCallback) window.requestIdleCallback(fn, { timeout: 4000 });
      else setTimeout(fn, 1500);
    }
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go);
  }
  afterPaint(loadGtag);

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
    params.page_url_path = location.pathname;
    gtag("event", name, params);
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
    if ((f.getAttribute("action") || "").indexOf("formspree.io") === -1) return;
    track("form_submit", { form_id: f.id || "quote_form", button_location: where(f) });
  }, true);
})();
