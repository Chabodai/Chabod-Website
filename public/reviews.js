/* Live Google reviews, as a progressive enhancement.
 *
 * The HTML already contains a working "Read Our Reviews on Google" card. This
 * script only REPLACES it once real review data has arrived. If the fetch
 * fails, the feed is empty or stale, JavaScript is off, or the Worker isn't
 * connected to Google yet, the original card stays exactly as it is — so the
 * page is never broken and never shows an error to a visitor.
 *
 * Review text is third-party content, so everything is written with
 * textContent / DOM nodes. No innerHTML anywhere in here.
 */
(function () {
  "use strict";

  var scroll = document.querySelector(".review-scroll");
  if (!scroll) return;

  var original = scroll.querySelector(".review-card");
  if (!original) return;

  // Copy the page's own inline styling so generated cards match this page.
  var cardStyle = original.getAttribute("style") || "";
  var starsNode = original.querySelector(".stars");
  var starsStyle = starsNode ? starsNode.getAttribute("style") || "" : "";
  var linkNode = original.querySelector("a[href]");
  var linkStyle = linkNode ? linkNode.getAttribute("style") || "" : "";
  var linkText = linkNode ? linkNode.textContent : "Read Our Reviews on Google →";
  var fallbackHref = linkNode ? linkNode.getAttribute("href") : null;

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function el(tag, style) {
    var n = document.createElement(tag);
    if (style) n.setAttribute("style", style);
    return n;
  }

  function card() {
    var c = el("div", cardStyle);
    c.className = "review-card";
    // Some pages fix .review-card to a short height for the placeholder card;
    // real review text needs room.
    c.style.height = "auto";
    return c;
  }

  function stars(n) {
    var s = el("div", starsStyle);
    s.className = "stars";
    var count = Math.max(0, Math.min(5, Math.round(n || 0)));
    s.textContent = "★".repeat(count) + "☆".repeat(5 - count);
    s.setAttribute("aria-label", count + " out of 5 stars");
    return s;
  }

  function monthYear(iso) {
    if (!iso) return "";
    var parts = String(iso).split("-");
    if (parts.length < 2) return "";
    var m = parseInt(parts[1], 10);
    if (!(m >= 1 && m <= 12)) return "";
    return MONTHS[m - 1] + " " + parts[0];
  }

  function summaryCard(data) {
    var c = card();
    c.appendChild(stars(data.rating));

    var headline = el("p", "font-weight:700; color:var(--blue); margin:6px 0;");
    headline.textContent = data.rating
      ? "Rated " + data.rating.toFixed(1) + " on Google"
      : "Reviewed on Google";
    c.appendChild(headline);

    var sub = el("p", "margin:0 0 14px;");
    sub.textContent = data.total
      ? "Based on " + data.total + " Google review" + (data.total === 1 ? "" : "s")
      : "Real reviews from real San Antonio clients.";
    c.appendChild(sub);

    var a = el("a", linkStyle);
    a.setAttribute("href", data.profileUrl || fallbackHref || "#");
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener");
    a.textContent = linkText;
    c.appendChild(a);
    return c;
  }

  function reviewCard(r) {
    var c = card();
    c.appendChild(stars(r.rating));

    var p = el("p", "margin:0;");
    p.textContent = "“" + r.text + "”";
    c.appendChild(p);

    var name = el("div", "");
    name.className = "rname";
    var when = monthYear(r.date);
    name.textContent = r.author + (when ? " · " + when : "");
    c.appendChild(name);
    return c;
  }

  function render(data) {
    var frag = document.createDocumentFragment();
    frag.appendChild(summaryCard(data));
    for (var i = 0; i < data.reviews.length; i++) frag.appendChild(reviewCard(data.reviews[i]));

    scroll.textContent = "";
    scroll.appendChild(frag);
    scroll.setAttribute("data-source", "google-live");
  }

  var done = false;
  var timeout = setTimeout(function () { done = true; }, 4000); // never hold the page

  fetch("/api/reviews", { headers: { accept: "application/json" } })
    .then(function (res) { return res.ok ? res.json() : null; })
    .then(function (data) {
      if (done) return;
      clearTimeout(timeout);
      if (!data || !data.ok || !data.reviews || !data.reviews.length) return; // keep the static card
      render(data);
    })
    .catch(function () { /* keep the static card */ });
})();
