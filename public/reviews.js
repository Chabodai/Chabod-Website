/* Shared Google reviews component. One file serves the homepage, /str-cleaning,
 * /residential-cleaning and /deep-cleaning.
 *
 * What the page contains without this script: the section heading, the
 * "5.0 on Google / Based on 44 Google reviews" header and the
 * "Read our reviews on Google" button, all plain HTML. That is also the fallback:
 * if the API fails, returns nothing, or JavaScript is off, that is what stays.
 * No empty slider, no error.
 *
 * What this adds: when the section is about to scroll into view (never at page
 * load) it loads reviews.css, fetches /api/reviews and builds a scroll-snap
 * slider of the real reviews. It never auto-advances. No libraries.
 *
 * Review text is third-party content: it is only ever written with textContent,
 * never innerHTML, and it is shown exactly as returned by the API.
 */
(function () {
  "use strict";

  var root = document.querySelector("[data-gr]");
  if (!root) return;
  var slot = root.querySelector("[data-gr-slot]");
  if (!slot) return;

  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var started = false;

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function collapse() {
    slot.style.display = "none"; // the summary header and Google link stay
  }

  /* ---- start: only when the section is near the viewport ---- */
  function start() {
    if (started) return;
    started = true;
    var cssReady = ensureCss();
    var dataReady = fetch("/api/reviews", { headers: { accept: "application/json" } })
      .then(function (res) { return res.ok ? res.json() : null; })
      .catch(function () { return null; });
    Promise.all([cssReady, dataReady]).then(function (r) { render(r[1]); });
  }

  var cssPromise = null;
  function ensureCss() { return cssPromise || (cssPromise = loadCss()); }

  function loadCss() {
    return new Promise(function (resolve) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/reviews.css";
      link.onload = link.onerror = function () { resolve(); };
      document.head.appendChild(link);
      setTimeout(resolve, 3000); // never hang on a slow stylesheet
    });
  }

  // The stylesheet is small and not render-blocking. Fetch it once the page has finished
  // loading and the browser is idle, so it is long since applied by the time anyone scrolls
  // here. (The reviews themselves are still only fetched when the section is near.)
  function warmCss() {
    if (window.requestIdleCallback) window.requestIdleCallback(ensureCss, { timeout: 2500 });
    else setTimeout(ensureCss, 800);
  }
  if (document.readyState === "complete") warmCss();
  else window.addEventListener("load", warmCss);

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) { io.disconnect(); start(); return; }
      }
    }, { rootMargin: "1200px 0px" });
    io.observe(root);
  } else {
    window.addEventListener("load", function () { setTimeout(start, 1500); });
  }

  /* ---- render ---- */
  function render(data) {
    if (!data || !data.ok) { collapse(); return; }

    // keep the header in step with the live numbers
    var ratingEl = root.querySelector(".gr-rating");
    if (ratingEl && typeof data.rating === "number") ratingEl.textContent = data.rating.toFixed(1) + " on Google";
    var countEl = root.querySelector(".gr-count");
    if (countEl && typeof data.total === "number" && data.total > 0) {
      countEl.textContent = "Based on " + data.total + " Google review" + (data.total === 1 ? "" : "s");
    }

    var reviews = (data.reviews || []).filter(function (r) { return r && r.text && r.rating; });
    if (!reviews.length) { collapse(); return; }

    var slider = build(reviews);
    slot.textContent = "";
    slot.appendChild(slider.el);
    // min-height stays as a floor: it can only grow, never collapse, so nothing below jumps
    slider.init();
  }

  function monthYear(iso) {
    var p = String(iso || "").split("-");
    var m = parseInt(p[1], 10);
    return p[0] && m >= 1 && m <= 12 ? MONTHS[m - 1] + " " + p[0] : "";
  }

  function chevron(dir) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("width", "20");
    svg.setAttribute("height", "20");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "2.5");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    svg.appendChild(path);
    return svg;
  }

  function build(reviews) {
    var wrap = h("div", "gr-slider");
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-roledescription", "carousel");
    wrap.setAttribute("aria-label", "Customer reviews from Google");

    var viewport = h("div", "gr-viewport");
    var track = h("div", "gr-track");
    track.tabIndex = 0;
    track.setAttribute("role", "group");
    track.setAttribute("aria-label", "Reviews. Use the left and right arrow keys to move between them.");

    var cards = [];
    for (var i = 0; i < reviews.length; i++) {
      var r = reviews[i];
      var card = h("article", "gr-card");
      card.setAttribute("role", "group");
      card.setAttribute("aria-roledescription", "slide");
      card.setAttribute("aria-label", (i + 1) + " of " + reviews.length);

      var stars = h("div", "gr-card-stars", new Array(Math.max(0, Math.min(5, Math.round(r.rating))) + 1).join("★"));
      stars.setAttribute("role", "img");
      stars.setAttribute("aria-label", r.rating + " out of 5 stars");

      var text = h("p", "gr-text", r.text);
      text.id = "gr-text-" + i;

      var more = h("button", "gr-more", "Read more");
      more.type = "button";
      more.hidden = true;
      more.setAttribute("aria-expanded", "false");
      more.setAttribute("aria-controls", text.id);

      var name = h("p", "gr-name", (r.author || "Google reviewer") + (monthYear(r.date) ? " · " + monthYear(r.date) : ""));

      card.appendChild(stars);
      card.appendChild(text);
      card.appendChild(more);
      card.appendChild(name);
      track.appendChild(card);
      cards.push({ card: card, text: text, more: more });
    }

    var prev = h("button", "gr-nav gr-prev");
    prev.type = "button";
    prev.setAttribute("aria-label", "Previous reviews");
    prev.appendChild(chevron("prev"));
    var next = h("button", "gr-nav gr-next");
    next.type = "button";
    next.setAttribute("aria-label", "Next reviews");
    next.appendChild(chevron("next"));

    viewport.appendChild(track);
    viewport.appendChild(prev);
    viewport.appendChild(next);

    var dotsBox = h("div", "gr-dots");
    dotsBox.setAttribute("role", "group");
    dotsBox.setAttribute("aria-label", "Choose a review");

    wrap.appendChild(viewport);
    wrap.appendChild(dotsBox);

    var dots = [];
    var ticking = false;

    function gap() {
      var cs = window.getComputedStyle(track);
      return parseFloat(cs.columnGap || cs.gap) || 16;
    }
    function step() { return cards[0].card.getBoundingClientRect().width + gap(); }
    function maxScroll() { return track.scrollWidth - track.clientWidth; }
    function pageCount() {
      var max = maxScroll();
      return max <= 2 ? 1 : Math.round(max / step()) + 1;
    }
    function current() {
      var n = pageCount();
      if (maxScroll() - track.scrollLeft <= 2) return n - 1;
      return Math.max(0, Math.min(n - 1, Math.round(track.scrollLeft / step())));
    }
    function goTo(i) {
      var n = pageCount();
      i = Math.max(0, Math.min(n - 1, i));
      var left = i === n - 1 ? maxScroll() : i * step();
      if (track.scrollTo) track.scrollTo({ left: left, behavior: reduceMotion ? "auto" : "smooth" });
      else track.scrollLeft = left;
    }

    function paint() {
      ticking = false;
      var n = pageCount();
      var c = current();
      var multi = n > 1;
      dotsBox.style.display = multi ? "" : "none";
      prev.style.visibility = next.style.visibility = multi ? "" : "hidden";
      prev.disabled = c <= 0;
      next.disabled = c >= n - 1;
      for (var i = 0; i < dots.length; i++) {
        if (i === c) dots[i].setAttribute("aria-current", "true");
        else dots[i].removeAttribute("aria-current");
      }
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(paint);
    }

    function buildDots() {
      var n = pageCount();
      if (dots.length === n) return;
      dotsBox.textContent = "";
      dots = [];
      for (var i = 0; i < n; i++) {
        (function (idx) {
          var d = h("button", "gr-dot");
          d.type = "button";
          d.setAttribute("aria-label", "Go to review " + (idx + 1));
          d.addEventListener("click", function () { goTo(idx); });
          dotsBox.appendChild(d);
          dots.push(d);
        })(i);
      }
    }

    // Only offer "Read more" where the text is really being clamped
    function measure() {
      for (var i = 0; i < cards.length; i++) {
        var c = cards[i];
        if (c.card.classList.contains("is-open")) continue;
        c.more.hidden = !(c.text.scrollHeight > c.text.clientHeight + 1);
      }
    }

    var queued = false;
    function relayout() {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(function () {
        queued = false;
        buildDots();
        measure();
        paint();
      });
    }

    track.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest ? e.target.closest(".gr-more") : null;
      if (!btn) return;
      var card = btn.closest(".gr-card");
      var open = !card.classList.contains("is-open");
      card.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "Show less" : "Read more";
      if (!open) measure();
    });

    track.addEventListener("keydown", function (e) {
      if (e.target !== track) return; // do not hijack keys used inside a card's button
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(current() + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current() - 1); }
      else if (e.key === "Home") { e.preventDefault(); goTo(0); }
      else if (e.key === "End") { e.preventDefault(); goTo(pageCount() - 1); }
    });

    prev.addEventListener("click", function () { goTo(current() - 1); });
    next.addEventListener("click", function () { goTo(current() + 1); });
    track.addEventListener("scroll", onScroll, { passive: true });

    return {
      el: wrap,
      init: function () {
        relayout();
        if ("ResizeObserver" in window) new ResizeObserver(relayout).observe(track);
        else window.addEventListener("resize", relayout);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
      }
    };
  }
})();
