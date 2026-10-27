// Node port of export_morse_sql.py, with the fix for the redesigned Morsehead page:
// room zones are now <section class="zone ..."> (they used to be <details class="zone ...">).
// usage: node export_morse_sql.js <dir containing site-morse/index.html>   -> writes <dir>/morse_items.sql
const fs = require('fs');
const dir = process.argv[2];
const h = fs.readFileSync(dir + '/site-morse/index.html', 'utf8');
const PAGE = '23f2531a-dd33-49f5-9ba0-ef458c99fe3d', CODE = '71a530337d5e4ad3';
const unesc = (s) => s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&amp;/g, '&');
const tx = (s, l) => { const m = new RegExp('<span class="t-' + l + '" lang="' + l + '">([\\s\\S]*?)</span>').exec(s); return m ? unesc(m[1]) : null; };
const q = (s) => "'" + s.replace(/'/g, "''") + "'";
const parts = h.split(/(?=<section class="card[^"]*" id="|<(?:details|section) class="zone[^"]*" id=")/);
const rows = []; let pos = 0;
for (const p of parts) {
  const m = /^<(?:section|details) class="[^"]*" id="([^"]+)"/.exec(p); if (!m) continue;
  const sid = m[1];
  const title = /<h[23][^>]*(?:class="ch")?[^>]*>(?:<svg[\s\S]*?<\/svg>)?([\s\S]*?)<\/h[23]>/.exec(p);
  const t = title ? title[1] : '';
  let ten = tx(t, 'en');
  if (!ten) ten = ({ musts: 'Must-do rules' })[sid] || sid;
  const items = [];
  for (const ck of p.matchAll(/<span class="ck-t">([\s\S]*?)<\/span><\/div>/g)) items.push({ type: 'ck', body: ck[1] });
  for (const a of p.matchAll(/<div class="abody"><h3>([\s\S]*?)<\/h3><p>([\s\S]*?)<\/p>/g)) items.push({ type: 'ab', label: a[1], body: a[2] });
  for (const b of p.matchAll(/<h4>([\s\S]*?)<\/h4><p class="bwhere">([\s\S]*?)<\/p><\/div><\/div><div class="layers">([\s\S]*?)<\/div>(?:<p class="bnote">([\s\S]*?)<\/p>)?/g)) {
    const lay = [...b[3].matchAll(/<span class="layer [^"]*">(<span class="t-en"[\s\S]*?<\/span><span class="t-es"[\s\S]*?<\/span>)<\/span>/g)].map((x) => x[1]);
    items.push({ type: 'bed', label: b[1], where: b[2], layers: { en: lay.map((x) => tx(x, 'en')).join(', '), es: lay.map((x) => tx(x, 'es')).join(', ') }, note: b[4] });
  }
  for (const c of p.matchAll(/<div class="ctr[^"]*"><span class="ctr-ic2">[\s\S]*?<span class="ctr-n"><b>(\d+)<\/b><\/span><span class="ctr-l">(<span class="t-en"[\s\S]*?<\/span><span class="t-es"[\s\S]*?<\/span>)<\/span>/g)) items.push({ type: 'ct', label: c[2], n: c[1] });
  const sec = ten;
  for (const it of items) {
    pos++;
    if (it.type === 'bed') {
      for (const l of ['en', 'es']) rows.push([sec, 'text', pos, tx(it.label, l), tx(it.where, l) + ' | ' + it.layers[l] + (it.note ? ' | ' + tx(it.note, l) : ''), l, null]);
    } else if (it.type === 'ct') {
      for (const l of ['en', 'es']) rows.push([sec, 'text', pos, tx(it.label, l), 'Count: ' + it.n, l, null]);
    } else {
      for (const l of ['en', 'es']) {
        const lab = it.label ? tx(it.label, l) : null;
        const body = it.body.includes('t-en') ? tx(it.body, l) : it.body;
        rows.push([sec, 'text', pos, lab, body, l, null]);
      }
    }
  }
  for (const th of p.matchAll(new RegExp('data-src="(?:/' + CODE + '/)?p/(\\d+)\\.jpg".*?data-cap-en="([^"]*)" data-cap-es="([^"]*)"', 'g'))) {
    pos++; rows.push([sec, 'photo', pos, unesc(th[2]), null, 'en', CODE + '/' + th[1] + '.jpg']);
  }
}
const vals = rows.map(([sec, kind, pos, lab, body, l, ph]) => '(' + [q(sec), q(kind), pos, lab ? q(lab) : 'null', body ? q(body) : 'null', q(l), ph ? q(ph) : 'null'].join(',') + ')');
const sql = "delete from sop_items where sop_page_id='" + PAGE + "';\ninsert into sop_items(sop_page_id,section,kind,position,label,body,lang,photo_path)\nselect '" + PAGE + "',v.* from (values\n" + vals.join(',\n') + '\n) as v(section,kind,position,label,body,lang,photo_path);';
fs.writeFileSync(dir + '/morse_items.sql', sql, 'utf8');
console.log(rows.length + ' rows, ' + sql.length + ' chars');
