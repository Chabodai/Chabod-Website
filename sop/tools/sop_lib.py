"""Shared pieces for the visual SOP pages (same components and markup as build_morse.py).
Used by build_viva2.py and build_post2.py. Content is written ONCE as tuples; this module renders the HTML and
the sop_items rows from that same source, so the database always matches the published page.
NO door / closet codes anywhere. Static and visual only: no checkboxes, counters, progress or collapsing zones."""
import html, os, re, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))

# ---------- state ----------
CODE = ""
PREFIX = ""
MEDIA = {}
ROWS = []          # dicts: sec, kind, pos, label, body_en, body_es, photo
_pos = [0]
used = set()


def init(code, media):
    global CODE, PREFIX, MEDIA
    CODE = code
    PREFIX = f"/{code}/"
    MEDIA = media
    ROWS.clear()
    used.clear()
    _pos[0] = 0


def _next():
    _pos[0] += 1
    return _pos[0]


def T(en, es, tag="span"):
    return (f'<{tag} class="t-en" lang="en">{html.escape(en)}</{tag}>'
            f'<{tag} class="t-es" lang="es">{html.escape(es)}</{tag}>')


# ---------- icons (Feather-style strokes) ----------
IC = {
 "home": '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
 "bed": '<path d="M2 19V5"/><path d="M2 15h20v4"/><path d="M22 15v-3a3 3 0 0 0-3-3h-8v6"/><circle cx="6.5" cy="11" r="1.8"/>',
 "drop": '<path d="M12 2.7l5.7 5.7a8 8 0 1 1-11.4 0z"/>',
 "coffee": '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>',
 "tv": '<rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/>',
 "wind": '<path d="M9.6 4.6A2 2 0 1 1 11 8H2m10.6 11.4A2 2 0 1 0 14 16H2m15.7-8.3A2.5 2.5 0 1 1 19.5 12H2"/>',
 "video": '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>',
 "camera": '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
 "alert": '<path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
 "temp": '<path d="M14 14.8V3.5a2.5 2.5 0 0 0-5 0v11.3a4.5 4.5 0 1 0 5 0z"/>',
 "mic": '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/>',
 "layers": '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
 "wash": '<rect x="3" y="2" width="18" height="20" rx="2"/><circle cx="12" cy="14" r="5"/><circle cx="7" cy="6" r="1"/>',
 "play": '<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>',
 "pot": '<path d="M4 11h16v7a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z"/><path d="M2 11h20"/><path d="M9 7V4M15 7V4"/>',
 "sun": '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.2" y1="4.2" x2="5.6" y2="5.6"/><line x1="18.4" y1="18.4" x2="19.8" y2="19.8"/><line x1="4.2" y1="19.8" x2="5.6" y2="18.4"/><line x1="18.4" y1="5.6" x2="19.8" y2="4.2"/>',
 "star": '<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/>',
 "check": '<polyline points="20 6 9 17 4 12"/>',
 "towel": '<path d="M4 5h16v11H4z"/><path d="M4 16c1 2 2 2 3 0s2-2 3 0 2 2 3 0 2-2 3 0 2 2 4 0"/><line x1="8" y1="5" x2="8" y2="16"/>',
 # added for the Viva / Post pages
 "lock": '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
 "key": '<path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>',
 "trash": '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
 "bulb": '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z"/>',
 "car": '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
 "stairs": '<path d="M3 21v-5h5v-5h5V6h5V3h3"/>',
}


def ic(n, cls="ic"):
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{IC[n]}</svg>')


# ---------- media ----------
# MEDIA id -> (kind, file, caption_en, caption_es, poster)   kind: photo | video
def PH(f, en, es):
    return ("photo", f, en, es, None)


def VD(f, en, es):
    return ("video", f, en, es, f)


def _rec_media(sec, ids):
    for m in ids:
        kind, f, cen, ces, _ = MEDIA[m]
        ext = "jpg" if kind == "photo" else "mp4"
        ROWS.append(dict(sec=sec, kind=kind, pos=_next(), label=cen, body_en=None, body_es=None,
                         photo=f"{CODE}/{f}.{ext}"))


def gallery(ids, sec=None):
    used.update(ids)
    if sec:
        _rec_media(sec, ids)
    cells = []
    for m in ids:
        kind, f, cen, ces, poster = MEDIA[m]
        if kind == "photo":
            src, full, post, badge = f"{PREFIX}p/{f}-t.jpg", f"{PREFIX}p/{f}.jpg", "", ""
        else:
            src, full, post = f"{PREFIX}v/{poster}-p.jpg", f"{PREFIX}v/{f}.mp4", f"{PREFIX}v/{poster}-p.jpg"
            badge = '<span class="play" aria-hidden="true"></span>'
        cells.append(
            f'<figure class="cell"><button class="thumb" type="button" data-kind="{kind}" data-src="{full}" '
            f'data-poster="{post}" data-cap-en="{html.escape(cen, True)}" data-cap-es="{html.escape(ces, True)}" '
            f'aria-label="{html.escape(cen, True)}"><img src="{src}" alt="" loading="lazy" decoding="async" '
            f'draggable="false">{badge}</button><figcaption>{T(cen, ces)}</figcaption></figure>')
    return '<div class="gallery strip">' + "".join(cells) + '</div>'


# ---------- components ----------
def _rec_text(sec, label, en, es):
    ROWS.append(dict(sec=sec, kind="text", pos=_next(), label=label, body_en=en, body_es=es, photo=None))


def ck(en, es):
    return (f'<div class="li"><span class="dot">{ic("check", "tick")}</span>'
            f'<span class="ck-t">{T(en, es)}</span></div>')


def ctr(n, en, es, icon="towel", tone=""):
    return (f'<div class="ctr {tone}"><span class="ctr-ic2">{ic(icon, "ic ctr-ic")}</span>'
            f'<span class="ctr-n"><b>{html.escape(str(n))}</b></span>'
            f'<span class="ctr-l">{T(en, es)}</span></div>')


def ctrs(sec, counters, one=False):
    """counters: list of (n, en, es, icon, tone)"""
    if not counters:
        return ""
    for n, en, es, *_ in counters:
        ROWS.append(dict(sec=sec, kind="text", pos=_next(), label=(en, es), body_en=f"Count: {n}",
                         body_es=f"Cantidad: {n}", photo=None))
    cls = "ctrs one" if one else "ctrs"
    return f'<div class="{cls}">' + "".join(ctr(*c) for c in counters) + '</div>'


def rnote(sec, en, es):
    """Soft, room-level note (yellow line). Not a red alert."""
    _rec_text(sec, None, en, es)
    return f'<p class="rnote">{T(en, es)}</p>'


def zone(zid, icon, en, es, tone, media, items, counters=(), notes=()):
    sec = en
    g = gallery(media, sec) if media else ""
    c = ctrs(sec, counters)
    lines = ""
    for a, b in items:
        _rec_text(sec, None, a, b)
        lines += ck(a, b)
    n = "".join(rnote(sec, a, b) for a, b in notes)
    return (f'<section class="zone {tone}" id="{zid}"><div class="zhead"><span class="zic">{ic(icon, "ic")}</span>'
            f'<h3>{T(en, es)}</h3></div><div class="zbody">{g}{c}'
            f'<div class="cks">{lines}</div>{n}</div></section>')


def alert(sec, icon, en, es, paras, counters=(), media=()):
    """House-wide critical rule. paras: list of (en, es)."""
    body_en = " ".join(p[0] for p in paras)
    body_es = " ".join(p[1] for p in paras)
    ROWS.append(dict(sec=sec, kind="text", pos=_next(), label=(en, es), body_en=body_en, body_es=body_es, photo=None))
    extra = ctrs(sec, counters, one=len(counters) == 1) if counters else ""
    extra += gallery(media, sec) if media else ""
    ps = "".join(f'<p>{T(a, b)}</p>' for a, b in paras)
    return (f'<div class="acard"><span class="aic">{ic(icon, "ic")}</span><div class="abody"><h3>{T(en, es)}</h3>'
            f'{ps}{extra}</div></div>')


def bedcard(sec, icon, tone, en, es, where_en, where_es, layers, note=None):
    lay = "".join(f'<span class="layer {c}">{T(a, b)}</span>' for a, b, c in layers)
    nt = f'<p class="bnote">{T(*note)}</p>' if note else ""
    ROWS.append(dict(sec=sec, kind="text", pos=_next(), label=(en, es),
                     body_en=where_en + " | " + "; ".join(l[0] for l in layers) + (" | " + note[0] if note else ""),
                     body_es=where_es + " | " + "; ".join(l[1] for l in layers) + (" | " + note[1] if note else ""),
                     photo=None))
    return (f'<div class="bed {tone}"><div class="bhead">{ic(icon, "ic")}<div><h4>{T(en, es)}</h4>'
            f'<p class="bwhere">{T(where_en, where_es)}</p></div></div><div class="layers">{lay}</div>{nt}</div>')


L_FIT = ("Fitted", "Sábana ajustable", "l-on")
L_FLAT = ("Flat sheet", "Sábana plana", "l-on")
L_DUV = ("Duvet", "Duvet", "l-on")
L_PIL = ("Decor pillows", "Almohadas decorativas", "l-on")
L_NODUV = ("No duvet", "Sin duvet", "l-off")
L_ROLL = ("Duvet rolled at the foot", "Duvet enrollado a los pies", "l-fold")
L_FOLD = ("Duvet folded", "Duvet doblado", "l-fold")


def card(cid, icon, en, es, inner, cls="card", sec=None):
    return f'<section class="{cls}" id="{cid}"><h2 class="ch">{ic(icon, "ic")}{T(en, es)}</h2>{inner}</section>'


def cklist(sec, items):
    out = ""
    for a, b in items:
        _rec_text(sec, None, a, b)
        out += ck(a, b)
    return f'<div class="cks">{out}</div>'


def floorhead(fid, label_html, en, es, alt=False):
    return (f'<div class="floorhead{" f2" if alt else ""}" id="{fid}"><span class="fl">{label_html}</span>'
            f'<h2>{T(en, es)}</h2></div>')


def tile(big, en, es, hot=False):
    return f'<div class="tile{" hot" if hot else ""}"><b>{html.escape(big)}</b><span>{T(en, es)}</span></div>'


def glance(tiles, towels, towel_title=("Towel counts", "Cantidad de toallas")):
    """tiles: 4x (big, en, es, hot).  towels: 3x (href, big, en, es, extra_html)."""
    t = "".join(tile(*x) for x in tiles)
    w = "".join(f'<a href="#{h}"><b>{html.escape(b)}</b><span>{T(en, es)}</span><i>{x}</i></a>' for h, b, en, es, x in towels)
    return (f'<section class="glance" aria-label="At a glance">{t}</section>'
            f'<section class="towelrow" aria-label="Towels"><h2 class="mini">{ic("towel", "ic")}{T(*towel_title)}</h2>'
            f'<div class="tw">{w}</div></section>')


def two(en1, es1, en2=None, es2=None):
    s = T(en1, es1)
    if en2:
        s += "<br>" + T(en2, es2)
    return s


def write_sql(path, page_id):
    def q(s):
        return "'" + s.replace("'", "''") + "'"
    vals = []
    for r in ROWS:
        for lang in ("en", "es"):
            if r["kind"] in ("photo", "video"):
                if lang == "es":
                    continue
                lab, body = r["label"], None
            else:
                lab = r["label"]
                if isinstance(lab, tuple):
                    lab = lab[0] if lang == "en" else lab[1]
                body = r["body_en"] if lang == "en" else r["body_es"]
            vals.append("(" + ",".join([q(r["sec"]), q(r["kind"]), str(r["pos"]), q(lab) if lab else "null",
                                        q(body) if body else "null", q(lang),
                                        q(r["photo"]) if r["photo"] else "null"]) + ")")
    sql = (f"delete from sop_items where sop_page_id='{page_id}';\n"
           f"insert into sop_items(sop_page_id,section,kind,position,label,body,lang,photo_path)\n"
           f"select '{page_id}',v.* from (values\n" + ",\n".join(vals) +
           "\n) as v(section,kind,position,label,body,lang,photo_path);")
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(sql)
    return len(vals)


def page_html(title_name, address, hero_cap, nav, glance_html, body, updated, note=None):
    css = "\n".join(open(os.path.join(HERE, n), encoding="utf-8").read() for n in ("sop.css", "sop2.css", "sop3.css"))
    js = open(os.path.join(HERE, "sop.js"), encoding="utf-8").read()
    chips = "".join(f'<a class="chip" href="#{i}">{T(a, b)}</a>' for i, a, b in nav)
    hero = (f'<div class="wrap"><figure class="hero"><img src="{PREFIX}p/house.jpg" alt="" decoding="async" draggable="false">'
            f'<figcaption>{T("This is the house", "Esta es la casa")}</figcaption></figure></div>')
    note = note or ("Door codes are sent with your assignment email. They are not on this page.",
                    "Los códigos de las puertas se envían en el correo de asignación. No están en esta página.")
    return f'''<meta charset="utf-8"><title>SOP</title>
<meta name="robots" content="noindex, nofollow"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Manrope:wght@400;500;700&display=swap">
<style>
{css}
</style>

<header class="top">
  <div class="wrap">
    <p class="eyebrow">Chabod Cleaning Services &middot; {T("Standard operating procedure", "Procedimiento estándar")}</p>
    <h1>{html.escape(title_name)}</h1>
    <p class="addr">{html.escape(address)}</p>
  </div>
</header>
{hero}

<div class="bar" role="navigation" aria-label="Sections">
  <div class="wrap barrow">
    <div class="lang" role="group" aria-label="Language">
      <button type="button" data-lang="en" aria-pressed="false">EN</button>
      <button type="button" data-lang="es" aria-pressed="false">ES</button>
    </div>
    <nav class="chips">{chips}</nav>
  </div>
</div>

<main class="wrap main">
{glance_html}
{body}
<p class="note">{T(*note)}</p>
</main>
<footer class="foot"><div class="wrap">Chabod Cleaning Services &middot; {T("Last updated", "Actualizado")} {updated}</div></footer>

<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Media viewer">
  <button class="lb-close" type="button" aria-label="Close">&times;</button>
  <button class="lb-nav lb-prev" type="button" aria-label="Previous"><span aria-hidden="true"></span></button>
  <div class="lb-stage" id="lbstage"></div>
  <button class="lb-nav lb-next" type="button" aria-label="Next"><span aria-hidden="true"></span></button>
  <div class="lb-cap"><span id="lbcap"></span> <span class="lb-count" id="lbcount"></span></div>
</div>

<script>
{js}
</script>
'''


def finish(out_dir, page, media):
    """Write index.html and verify every referenced asset exists."""
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as fh:
        fh.write(page)
    refs = set(re.findall(r'(?:data-src|data-poster|src)="' + re.escape(PREFIX) + r'([^"]+)"', page))
    missing = sorted(r for r in refs if not os.path.isfile(os.path.join(out_dir, r.replace("/", os.sep))))
    unplaced = set(media) - used
    assert not missing, f"missing files: {missing}"
    assert not unplaced, f"media not placed on the page: {sorted(unplaced)}"
    print("built", len(page), "bytes;", len(used), "media placed;", len(refs), "files referenced; all exist")


def final_video(extra=()):
    """Final-video block: ONE video, no photos at the end (photos belong to 'Start here')."""
    items = list(zip(VID_EN, VID_ES)) + list(extra)
    return (f'<h3 class="sub2">{ic("video", "ic")}{T("Final video", "Video final")}</h3>' +
            cklist("Final video", items))

VID_EN = ['Your final product is one video of the whole house, with the date and time on screen (timestamp camera app).', 'Go zone by zone, slowly: floor by floor, every room and every bathroom.', 'Open the drawers.', 'Test the TVs: show that they turn on.', 'Zoom in on the special areas: the coffee station, where the trash bags are, where the toilet paper is, and the number of towels.', 'Show any other extra detail there is.']
VID_ES = ['El producto final es un video de toda la casa, con la fecha y la hora visibles en pantalla (app de cámara con timestamp).', 'Ve zona por zona, despacio: piso por piso, cada cuarto y cada baño.', 'Abre los cajones.', 'Prueba los televisores: muestra que prenden.', 'Enfoca bien las zonas especiales: la zona del café, donde están las bolsas de basura, donde están los papeles higiénicos y la cantidad de toallas.', 'Muestra cualquier otro detalle extra que exista.']
