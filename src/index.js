// ---- Chabod Cleaning Services — KV-backed blog ----
//
// This file only handles the blog (/blog and /blog/{slug}). Every other
// URL falls through to env.ASSETS, which serves the existing static HTML
// files exactly as before — nothing about the rest of the site changes.

const CATEGORIES = ["All Posts", "STR & Airbnb Hosts", "Residential Tips", "San Antonio Local", "Behind the Scenes"];

// Lifted directly from blog.html's <style> block so the dynamic pages are
// visually identical to the rest of the site (same fonts, colors, header,
// footer, floating nav, and responsive breakpoints).
const SHARED_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap');

:root {
  --blue: #294b9b;
  --teal-dark: #008eb5;
  --teal-light: #58bec2;
  --coral: #eb5c3d;
  --grey: #ededed;
  --ink: #23262b;
  --paper: #ffffff;
  --line: #e2e2e2;
}

* { box-sizing: border-box; margin: 0; padding: 0; }
strong { font-weight: 800; }

body {
  overflow-x: hidden;
  background: var(--paper);
  color: var(--ink);
  font-family: 'Manrope', sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3 {
  font-family: 'Baloo 2', sans-serif;
  font-weight: 600;
  line-height: 1.15;
  color: var(--blue);
}

.wrap { max-width: 480px; width: 100%; margin: 0 auto; }
.pad { padding: 28px 24px; }

.photo {
  background: repeating-linear-gradient(135deg, #dbeef0, #dbeef0 10px, #eaf6f7 10px, #eaf6f7 20px);
  border: 1px solid var(--line);
  color: #4a7075;
  font-family: 'Manrope', monospace;
  font-size: 12.5px;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px;
}
.photo img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: inherit; }
.photo:has(img) { padding: 0; background: none; border: none; }

/* ===== LOGO BAR ===== */
.logo-bar {
  background: #fff;
  text-align: center;
  padding: 16px 24px;
  border-bottom: 1px solid var(--line);
}
.logo-bar img, .site-logo { height: 38px; width: auto; max-width: 60%; display: block; }
.logo-bar .bar-phone { display: none; }
@media (min-width: 700px) {
  .logo-bar { display: flex; align-items: center; justify-content: space-between; text-align: left; padding: 16px 32px; }
  .logo-bar .bar-phone { display: block; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; color: var(--blue); text-decoration: none; }
}

/* ===== HERO ===== */
.blog-hero { background: var(--blue); padding: 26px 24px 24px; text-align: center; }
.blog-hero h1 { color: #fff; font-size: 28px; margin-bottom: 10px; }
.blog-hero p { color: #dbe3f5; font-size: 15.5px; max-width: 36ch; margin: 0 auto; }

/* ===== CATEGORY FILTER CHIPS ===== */
.cat-row { display: flex; gap: 8px; overflow-x: auto; padding: 16px 24px; -webkit-overflow-scrolling: touch; }
.cat-chip {
  flex-shrink: 0;
  border: 1px solid var(--line);
  background: var(--grey);
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  font-size: 13px;
  padding: 8px 14px;
  border-radius: 20px;
  color: var(--blue);
  white-space: nowrap;
  text-decoration: none;
}
.cat-chip.active { background: var(--blue); color: #fff; border-color: var(--blue); }

/* ===== FEATURED POST ===== */
.featured { padding: 4px 24px 24px; }
.featured-card {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  text-decoration: none;
  color: inherit;
  display: block;
}
.featured-card .photo { height: 180px; border: none; border-radius: 0; }
.featured-body { padding: 18px; }
.featured-tag {
  display: inline-block;
  font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px;
  letter-spacing: 0.05em; text-transform: uppercase;
  color: var(--coral); margin-bottom: 8px;
}
.featured-body h2 { font-size: 21px; margin-bottom: 8px; }
.featured-body p { font-size: 15px; color: #4a4a4a; margin-bottom: 12px; }
.post-meta { font-size: 12.5px; color: #8a8a8a; font-family: 'Manrope', sans-serif; }

/* ===== POST GRID ===== */
.post-list { padding: 0 24px 24px; }
.post-list h2 { font-size: 20px; margin-bottom: 16px; }
.post-card {
  display: flex; gap: 14px;
  padding: 16px 0;
  border-top: 1px solid var(--line);
  text-decoration: none;
  color: inherit;
}
.post-card:last-child { border-bottom: 1px solid var(--line); }
.post-card .photo { width: 100px; height: 100px; flex-shrink: 0; border-radius: 10px; font-size: 10.5px; }
.post-card-body { flex: 1; min-width: 0; }
.post-card-tag {
  font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 10.5px;
  letter-spacing: 0.04em; text-transform: uppercase; color: var(--teal-dark); margin-bottom: 4px;
}
.post-card h3 { font-size: 16.5px; margin-bottom: 4px; line-height: 1.25; }
.post-card p { font-size: 13.5px; color: #666; margin-bottom: 6px; }

/* ===== NEWSLETTER / CTA STRIP ===== */
.blog-cta { background: var(--grey); text-align: center; padding: 26px 24px; }
.blog-cta h2 { font-size: 19px; margin-bottom: 8px; }
.blog-cta p { font-size: 14.5px; color: #555; margin-bottom: 16px; }
.btn {
  display: inline-block; background: var(--coral); color: #fff;
  font-family: 'Baloo 2', sans-serif; font-weight: 600; font-size: 17px;
  padding: 13px 20px; border-radius: 8px; text-decoration: none;
}

.note {
  font-family: 'Manrope', sans-serif; font-size: 12px; color: #8a8a8a;
  text-align: center; padding: 16px 24px; letter-spacing: 0.02em;
}

/* ===== FLOATING NAV ===== */
.fab-nav { position: fixed; bottom: 22px; right: 20px; z-index: 999; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
.fab-button {
  width: 58px; height: 58px; border-radius: 50%;
  background: var(--coral); border: none; cursor: pointer;
  box-shadow: 0 6px 18px rgba(0,0,0,0.28);
  display: flex; align-items: center; justify-content: center;
  position: relative; z-index: 2;
  transition: transform 0.3s ease;
  padding: 0;
}
.fab-icon { position: relative; width: 20px; height: 20px; }
.fab-icon::before, .fab-icon::after {
  content: ''; position: absolute; background: #fff; border-radius: 2px;
  transition: transform 0.3s ease;
}
.fab-icon::before { width: 20px; height: 3px; top: 50%; left: 0; transform: translateY(-50%); }
.fab-icon::after { width: 3px; height: 20px; left: 50%; top: 0; transform: translateX(-50%); }
.fab-nav.open .fab-button { transform: rotate(90deg) scale(1.05); }
.fab-nav.open .fab-icon::before { transform: translateY(-50%) rotate(90deg); opacity: 0; }
.fab-nav.open .fab-icon::after { transform: translateX(-50%) rotate(0deg); }

.fab-menu { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; margin-bottom: 2px; }
.fab-item {
  background: #fff; color: var(--blue);
  font-family: 'Baloo 2', sans-serif; font-weight: 600; font-size: 14px;
  padding: 10px 18px; border-radius: 22px; text-decoration: none;
  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
  opacity: 0; transform: translateY(10px) scale(0.9);
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
  white-space: nowrap;
}
.fab-nav.open .fab-item { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
.fab-nav.open .fab-item:nth-child(1) { transition-delay: 0.03s; }
.fab-nav.open .fab-item:nth-child(2) { transition-delay: 0.07s; }
.fab-nav.open .fab-item:nth-child(3) { transition-delay: 0.11s; }
.fab-nav.open .fab-item:nth-child(4) { transition-delay: 0.15s; }
.fab-nav.open .fab-item:nth-child(5) { transition-delay: 0.19s; }
.fab-item.current { background: var(--grey); color: #999; pointer-events: none; }

/* ===== DESKTOP / TABLET ===== */
@media (min-width: 700px) {
  body { background: #f4f6f8; }
  .wrap {
    max-width: 1100px;
    background: var(--paper);
    box-shadow: 0 0 40px rgba(0,0,0,0.07);
    min-height: 100vh;
  }
  .logo-bar img, .site-logo { height: 44px; }
  .fab-nav { right: calc(50% - 550px + 20px); }
  .pad { max-width: 700px; margin-left: auto; margin-right: auto; }
  .btn { max-width: 420px; }
  .btn-row { align-items: center; }
}

/* ===== SITE FOOTER ===== */
.site-footer { background:#101b3d; color:#c9d4ee; padding:38px 22px 26px; }
.site-footer .f-logo-pill { background:#fff; border-radius:14px; padding:12px 16px; display:inline-block; margin-bottom:16px; }
.site-footer .f-logo-pill img { height:36px; width:auto; display:block; }
.site-footer .f-tag { font-size:14px; line-height:1.6; color:#c9d4ee; margin:0 0 22px; max-width:340px; }
.site-footer .f-callrow { display:flex; flex-direction:column; gap:10px; margin-bottom:26px; }
.site-footer .f-phone { font-family:'Baloo 2',cursive; font-weight:700; font-size:26px; color:#fff; text-decoration:none; letter-spacing:.3px; }
.site-footer .f-phone span { display:block; font-family:'Manrope',sans-serif; font-weight:600; font-size:11px; letter-spacing:1.4px; text-transform:uppercase; color:#58bec2; margin-bottom:2px; }
.site-footer .f-text-btn { display:inline-block; background:#eb5c3d; color:#fff; text-decoration:none; font-weight:700; font-size:14px; padding:12px 20px; border-radius:30px; align-self:flex-start; }
.site-footer .f-cols { display:flex; gap:34px; flex-wrap:wrap; margin-bottom:26px; }
.site-footer .f-col h4 { font-family:'Manrope',sans-serif; font-size:11px; letter-spacing:1.4px; text-transform:uppercase; color:#58bec2; margin:0 0 12px; font-weight:700; }
.site-footer .f-col a { display:block; color:#dbe4f7; text-decoration:none; font-size:14px; margin-bottom:9px; }
.site-footer .f-col a:hover { color:#fff; }
.site-footer .f-areas { border-top:1px solid rgba(255,255,255,.12); padding-top:20px; margin-bottom:20px; }
.site-footer .f-areas h4 { font-family:'Manrope',sans-serif; font-size:11px; letter-spacing:1.4px; text-transform:uppercase; color:#58bec2; margin:0 0 10px; font-weight:700; }
.site-footer .f-areas p { font-size:13px; line-height:1.8; color:#a9b8db; margin:0; }
.site-footer .f-bottom { border-top:1px solid rgba(255,255,255,.12); padding-top:18px; font-size:12px; line-height:1.7; color:#8496bd; }
.site-footer .f-bottom strong { color:#c9d4ee; font-weight:700; }
.site-footer .f-legal-links { margin-top: 10px; }
.site-footer .f-legal-links a { color:#8496bd; text-decoration:none; font-size:12px; }
.site-footer .f-legal-links a:hover { color:#c9d4ee; text-decoration:underline; }
.site-footer .f-legal-links span { color:#5a6a91; margin: 0 6px; font-size:12px; }
@media (min-width:700px){
  .site-footer { padding: 50px 40px 30px; }
  .site-footer > * { max-width: 860px; margin-left: auto; margin-right: auto; }
  .site-footer .f-logo-pill, .site-footer .f-tag, .site-footer .f-callrow, .site-footer .f-cols {
    max-width: none;
    margin: 0;
  }
  .site-footer .f-top {
    max-width: 860px; margin: 0 auto;
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    column-gap: 60px;
    align-items: start;
  }
  .site-footer .f-brand { grid-column: 1; }
  .site-footer .f-tag { max-width: 380px; }
  .site-footer .f-cols { grid-column: 2; gap: 60px; margin-bottom: 0; }
}

/* ===== DESKTOP NAV ===== */
.desktop-nav { display: none; }
@media (min-width: 700px) {
  .desktop-nav { display: flex; align-items: center; gap: 26px; }
  .desktop-nav a { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14.5px; color: var(--blue); text-decoration: none; opacity: .72; white-space: nowrap; }
  .desktop-nav a:hover { opacity: 1; }
  .desktop-nav a.current { opacity: 1; border-bottom: 2px solid var(--coral); padding-bottom: 3px; }
  .fab-nav { display: none; }
}

/* ===== BLOG DESKTOP LAYOUT ===== */
@media (min-width: 700px) {
  .blog-hero h1, .blog-hero p { max-width: 480px; margin-left: auto; margin-right: auto; }
  .post-list { max-width: 960px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
  .post-list > h2 { grid-column: 1 / -1; }
  .post-card { border: 1px solid var(--line); border-radius: 12px; padding: 14px; }
  .featured-card { max-width: 960px; margin-left: auto; margin-right: auto; }
}

/* ===== INDIVIDUAL POST PAGE ===== */
.post-hero { background: var(--blue); padding: 20px 24px; }
.post-hero a { color: #dbe3f5; text-decoration: none; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; }
.post-hero a:hover { color: #fff; }
.article { padding: 28px 24px 8px; max-width: 720px; margin: 0 auto; }
.article .article-tag {
  font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 11.5px;
  letter-spacing: 0.05em; text-transform: uppercase; color: var(--coral); margin-bottom: 10px; display: block;
}
.article h1 { font-size: 26px; margin-bottom: 10px; }
.article .post-meta { margin-bottom: 24px; display: block; }
.article-body { font-size: 16px; line-height: 1.75; color: #333; }
.article-body h2 { font-size: 21px; margin: 28px 0 12px; }
.article-body h3 { font-size: 18px; margin: 22px 0 10px; }
.article-body p { margin-bottom: 16px; }
.article-body ul, .article-body ol { margin: 0 0 16px 22px; }
.article-body li { margin-bottom: 6px; }
.article-body a { color: var(--teal-dark); }
.article-body table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14.5px; }
.article-body th, .article-body td { border: 1px solid var(--line); padding: 10px; text-align: left; }
.article-body th { background: var(--grey); }
.article-body img { max-width: 100%; border-radius: 10px; margin: 12px 0; }
@media (min-width: 700px) { .article { padding: 40px 24px 8px; } }
`;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
}

function siteHeader(current) {
  const links = [
    { href: "/index.html", label: "Home" },
    { href: "/str-cleaning.html", label: "STR Cleaning" },
    { href: "/residential-cleaning.html", label: "Residential" },
    { href: "/deep-cleaning.html", label: "Deep Cleaning" },
    { href: "/blog", label: "Blog" },
  ];
  const navHtml = links.map(l =>
    `<a href="${l.href}"${l.label === current ? ' class="current"' : ""}>${l.label}</a>`
  ).join("\n      ");

  return `
  <div class="logo-bar">
    <img src="/logo.webp" alt="Chabod Cleaning Services logo" class="site-logo">
    <nav class="desktop-nav">
      ${navHtml}
    </nav>
    <a href="tel:+12104806224" class="bar-phone">(210) 480-6224</a>
  </div>`;
}

function floatingNav(current) {
  const links = [
    { href: "/index.html", label: "Home" },
    { href: "/str-cleaning.html", label: "STR Cleaning" },
    { href: "/residential-cleaning.html", label: "Residential" },
    { href: "/deep-cleaning.html", label: "Deep Cleaning" },
    { href: "/blog", label: "Blog" },
  ];
  const itemsHtml = links.map(l =>
    `<a href="${l.href}" class="fab-item${l.label === current ? " current" : ""}">${l.label}</a>`
  ).join("\n      ");

  return `
  <div class="fab-nav" id="fabNav">
    <div class="fab-menu">
      ${itemsHtml}
    </div>
    <button class="fab-button" id="fabButton" aria-label="Menu" aria-expanded="false">
      <span class="fab-icon"></span>
    </button>
  </div>`;
}

function siteFooter() {
  return `
  <footer class="site-footer">
    <div class="f-top">
      <div class="f-brand">
        <div class="f-logo-pill"><img src="/logo.webp" alt="Chabod Cleaning Services logo"></div>
        <p class="f-tag">Family-owned cleaning for San Antonio homes and short-term rentals. No contracts, no call centers &mdash; you talk to the owner.</p>
        <div class="f-callrow">
          <a class="f-phone" href="tel:+12104806224"><span>Call or text</span>(210) 480-6224</a>
          <a class="f-text-btn" href="sms:+12104806224">Text Us for a Quote</a>
        </div>
      </div>
      <div class="f-cols">
        <div class="f-col">
          <h4>Services</h4>
          <a href="/str-cleaning">Airbnb &amp; STR Cleaning</a>
          <a href="/residential-cleaning">Residential Cleaning</a>
          <a href="/deep-cleaning">Deep Cleaning</a>
        </div>
        <div class="f-col">
          <h4>Company</h4>
          <a href="/">Home</a>
          <a href="/blog">Blog</a>
          <a href="tel:+12104806224">Contact</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms-conditions">Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
    <div class="f-areas">
      <h4>Service Areas</h4>
      <p>San Antonio &middot; Alamo Heights &middot; Schertz &middot; Cibolo &middot; Converse &middot; Universal City &middot; Live Oak &middot; Saint Hedwig &middot; Marion</p>
    </div>
    <div class="f-bottom">
      <strong>Chabod Cleaning Services LLC</strong><br>
      San Antonio, Texas &middot; Family owned and operated<br>
      &copy; 2026 Chabod Cleaning Services LLC. All rights reserved.
      <div class="f-legal-links">
        <a href="/privacy-policy">Privacy Policy</a>
        <span>&middot;</span>
        <a href="/terms-conditions">Terms &amp; Conditions</a>
      </div>
    </div>
  </footer>`;
}

function pageShell({ title, description, current, bodyHtml, canonicalPath, image, extraSchema }) {
  const url = `https://chabodcleaningservices.com${canonicalPath}`;
  const extraSchemaTag = extraSchema
    ? `<script type="application/ld+json">\n${JSON.stringify(extraSchema, null, 2)}\n</script>\n`
    : "";
  const imageUrl = image ? `https://chabodcleaningservices.com${image}` : null;
  const imageTags = imageUrl
    ? `<meta property="og:image" content="${imageUrl}">\n<meta name="twitter:image" content="${imageUrl}">\n`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<link rel="canonical" href="${url}">
<link rel="icon" type="image/png" href="/favicon.png">
<meta name="description" content="${escapeHtml(description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Chabod Cleaning Services">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:url" content="${url}">
${imageTags}<meta name="twitter:card" content="${imageUrl ? "summary_large_image" : "summary"}">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  "@id": "https://chabodcleaningservices.com/#business",
  "name": "Chabod Cleaning Services",
  "image": "https://chabodcleaningservices.com/logo.webp",
  "telephone": "+12104806224",
  "email": "home@chabodcleaningservices.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "523 White Cyn",
    "addressLocality": "San Antonio",
    "addressRegion": "TX",
    "postalCode": "78260",
    "addressCountry": "US"
  },
  "areaServed": [
    { "@type": "City", "name": "San Antonio" },
    { "@type": "City", "name": "Alamo Heights" },
    { "@type": "City", "name": "Schertz" },
    { "@type": "City", "name": "Cibolo" },
    { "@type": "City", "name": "Converse" },
    { "@type": "City", "name": "Universal City" },
    { "@type": "City", "name": "Live Oak" },
    { "@type": "City", "name": "Saint Hedwig" },
    { "@type": "City", "name": "Marion" }
  ],
  "priceRange": "$$",
  "founder": {
    "@type": "Person",
    "name": "Andrés"
  },
  "foundingDate": "2018",
  "url": "${url}"
}
</script>
${extraSchemaTag}<style>${SHARED_STYLES}</style>
</head>
<body>
<div class="wrap">
${siteHeader(current)}
${bodyHtml}
</div>
${siteFooter()}
${floatingNav(current)}
<script>
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

document.addEventListener('DOMContentLoaded', function () {
  const fabNav = document.getElementById('fabNav');
  const fabButton = document.getElementById('fabButton');
  if (fabNav && fabButton) {
    fabButton.addEventListener('click', () => {
      const isOpen = fabNav.classList.toggle('open');
      fabButton.setAttribute('aria-expanded', isOpen);
    });
  }
});
</script>
</body>
</html>`;
}

function photoBoxHtml(image, alt, placeholderText) {
  return image
    ? `<div class="photo"><img src="${escapeHtml(image)}" alt="${escapeHtml(alt)}"></div>`
    : `<div class="photo">${placeholderText}</div>`;
}

function postCardHtml(post) {
  return `
    <a href="/blog/${encodeURIComponent(post.slug)}" class="post-card">
      ${photoBoxHtml(post.image, post.image_alt || post.title, "[ PHOTO ]")}
      <div class="post-card-body">
        <div class="post-card-tag">${escapeHtml(post.category)}</div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
        <div class="post-meta">${escapeHtml(post.read_time)}</div>
      </div>
    </a>`;
}

async function renderBlogIndex(request, env) {
  const url = new URL(request.url);
  const selectedCategory = url.searchParams.get("category") || "All Posts";

  const indexRaw = await env.BLOG_POSTS.get("index");
  const allPosts = indexRaw ? JSON.parse(indexRaw) : [];

  const posts = selectedCategory === "All Posts"
    ? allPosts
    : allPosts.filter(p => p.category === selectedCategory);

  const sorted = [...posts].sort((a, b) => new Date(b.date_published) - new Date(a.date_published));
  const featured = sorted.find(p => p.featured);
  const recent = sorted.filter(p => p !== featured);

  const chipsHtml = CATEGORIES.map(c => {
    const href = c === "All Posts" ? "/blog" : `/blog?category=${encodeURIComponent(c)}`;
    const activeClass = c === selectedCategory ? " active" : "";
    return `<a href="${href}" class="cat-chip${activeClass}">${escapeHtml(c)}</a>`;
  }).join("\n    ");

  const featuredHtml = featured ? `
  <div class="featured reveal">
    <a href="/blog/${encodeURIComponent(featured.slug)}" class="featured-card">
      ${photoBoxHtml(featured.image, featured.image_alt || featured.title, "[ FEATURED POST PHOTO ]")}
      <div class="featured-body">
        <span class="featured-tag">${escapeHtml(featured.category)}</span>
        <h2>${escapeHtml(featured.title)}</h2>
        <p>${escapeHtml(featured.excerpt)}</p>
        <div class="post-meta">${escapeHtml(featured.read_time)}</div>
      </div>
    </a>
  </div>` : "";

  const postsHtml = recent.length
    ? recent.map(postCardHtml).join("\n")
    : `<p style="padding: 0 0 20px; color: #888;">No posts in this category yet.</p>`;

  const body = `
  <div class="blog-hero">
    <h1>The Chabod Blog</h1>
    <p>Cleaning tips, STR host advice, and San Antonio home care &mdash; from the team that actually does the work.</p>
  </div>

  <div class="cat-row">
    ${chipsHtml}
  </div>
${featuredHtml}
  <div class="post-list reveal">
    <h2>${selectedCategory === "All Posts" ? "Recent Posts" : escapeHtml(selectedCategory)}</h2>
    ${postsHtml}
  </div>

  <div class="blog-cta reveal">
    <h2>Have a topic you want covered?</h2>
    <p>Text us what you're curious about &mdash; we might write about it.</p>
    <a href="sms:+12104806224" class="btn">Text Us an Idea</a>
  </div>`;

  return new Response(
    pageShell({
      title: "San Antonio Cleaning Tips & STR Host Advice | Chabod Blog",
      description: "Cleaning advice, STR host tips, and San Antonio-specific guides from Chabod Cleaning Services — deep cleaning, turnover prep, and more.",
      current: "Blog",
      bodyHtml: body,
      canonicalPath: "/blog",
      image: featured ? featured.image : null,
    }),
    { headers: { "content-type": "text/html;charset=UTF-8" } }
  );
}

async function renderBlogPost(env, slug) {
  const raw = await env.BLOG_POSTS.get(`post:${slug}`);
  if (!raw) {
    const body = `
    <div class="pad" style="text-align:center; padding-top: 60px; padding-bottom: 60px;">
      <h1>Post Not Found</h1>
      <p style="margin: 16px 0;">We couldn't find that blog post.</p>
      <a href="/blog" class="btn">Back to Blog</a>
    </div>`;
    return new Response(
      pageShell({ title: "Post Not Found | Chabod Cleaning Services Blog", description: "This post could not be found.", current: "Blog", bodyHtml: body, canonicalPath: "/blog" }),
      { status: 404, headers: { "content-type": "text/html;charset=UTF-8" } }
    );
  }

  const post = JSON.parse(raw);

  const body = `
  <div class="post-hero">
    <a href="/blog">&larr; Back to Blog</a>
  </div>
  <article class="article">
    <span class="article-tag">${escapeHtml(post.category)}</span>
    <h1>${escapeHtml(post.title)}</h1>
    <div class="post-meta">${escapeHtml(post.read_time)}</div>
    <div class="article-body">
      ${post.content_html}
    </div>
  </article>
  <div class="blog-cta reveal" style="margin-top: 20px;">
    <h2>Have a topic you want covered?</h2>
    <p>Text us what you're curious about &mdash; we might write about it.</p>
    <a href="sms:+12104806224" class="btn">Text Us an Idea</a>
  </div>`;

  return new Response(
    pageShell({
      title: `${post.title} | Chabod Cleaning Services Blog`,
      description: post.meta_description || post.excerpt || post.title,
      current: "Blog",
      bodyHtml: body,
      canonicalPath: `/blog/${slug}`,
      extraSchema: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.meta_description || post.excerpt || post.title,
        "datePublished": post.date_published,
        "author": { "@id": "https://chabodcleaningservices.com/#business" },
        "publisher": { "@id": "https://chabodcleaningservices.com/#business" },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://chabodcleaningservices.com/blog/${slug}`,
        },
        ...(post.image ? { image: `https://chabodcleaningservices.com${post.image}` } : {}),
        ...(post.category ? { articleSection: post.category } : {}),
      },
      image: post.image || null,
    }),
    { headers: { "content-type": "text/html;charset=UTF-8" } }
  );
}

// Permanent redirects. Cloudflare's asset handler already sends *.html to the
// extensionless URL, but as a 307 — search engines treat that as temporary and
// keep the .html version in the index. These paths are listed in
// wrangler.jsonc's run_worker_first so the worker can answer with a 301 first.
const PERMANENT_REDIRECTS = {
  "/index.html": "/",
  "/str-cleaning.html": "/str-cleaning",
  "/residential-cleaning.html": "/residential-cleaning",
  "/deep-cleaning.html": "/deep-cleaning",
  "/privacy-policy.html": "/privacy-policy",
  "/terms-conditions.html": "/terms-conditions",
  // Legacy URL from the previous site, still indexed and currently 404ing.
  "/en/home": "/",
  "/en/home/": "/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const redirectTo = PERMANENT_REDIRECTS[url.pathname];
    if (redirectTo) {
      return Response.redirect(new URL(redirectTo + url.search, url.origin).toString(), 301);
    }

    if (url.pathname === "/blog" || url.pathname === "/blog/") {
      return renderBlogIndex(request, env);
    }

    if (url.pathname.startsWith("/blog/images/")) {
      return env.ASSETS.fetch(request);
    }

    if (url.pathname.startsWith("/blog/")) {
      const slug = decodeURIComponent(url.pathname.slice("/blog/".length)).replace(/\/$/, "");
      if (slug) return renderBlogPost(env, slug);
    }

    return env.ASSETS.fetch(request);
  },
};
