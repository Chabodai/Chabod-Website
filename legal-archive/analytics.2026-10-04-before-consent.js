/* Shared analytics loader for the whole site.
 *
 *   Google Analytics 4   G-W2673C88JM   (the only Measurement ID for this site)
 *   Microsoft Clarity    ysa4js5f6n     (loads after Google Analytics)
 *
 * ONE file, included on every page with <script src="/analytics.js" defer>.
 * To switch ALL analytics off, set ENABLED to false below (or empty this file):
 * one edit, no page has to change. Clarity alone: set CLARITY_ENABLED to false.
 *
 * Speed rules this file follows:
 *   - It is deferred, tiny, and does nothing at parse time except queue a few calls.
 *   - Nothing from Google (or Microsoft) is requested until a visitor actually
 *     interacts (scroll, touch, key, mouse), or 5 seconds after the page has
 *     loaded, whichever comes first, and then only when the browser is idle. A tap
 *     on Call / Text / the menu or a form submit starts it at once. So it never
 *     competes with the hero image, fonts, first paint or a lab speed test.
 *   - Events fired before gtag.js arrives are queued in dataLayer and sent later.
 *   - Trade-off to know about: a visitor who leaves within ~5 seconds without
 *     touching anything is not counted.
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
  var tagsStarted = false;
  var tagsScheduled = false;

  function startTags() {
    if (tagsStarted) return;
    tagsStarted = true;
    var g = loadGtag();
    afterGtag(g, loadClarity);
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
  for (var t = 0; t < TRIGGERS.length; t++) window.addEventListener(TRIGGERS[t], onFirstInteraction, { passive: true });
  afterLoad(function () { setTimeout(scheduleTags, MAX_WAIT_MS); });

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
    if ((f.getAttribute("action") || "").indexOf("formspree.io") === -1) return;
    track("form_submit", { form_id: f.id || "quote_form", button_location: where(f) });
  }, true);
})();
