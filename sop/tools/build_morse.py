#!/usr/bin/env python3
"""Builds the static, interactive SOP page for Morsehead (content mirrors Supabase sop_items for sop_page 23f2531a-...).
NO door / closet codes on this page. Run: python3 -I build_morse.py <scratchpad> [prod]"""
import html, os, shutil, sys

S = sys.argv[1]
PROD = len(sys.argv) > 2 and sys.argv[2] == "prod"
CODE = "71a530337d5e4ad3"
PREFIX = f"/{CODE}/" if PROD else ""
OUT = os.path.join(S, "worker", "public", CODE) if PROD else os.path.join(S, "site-morse")
if os.path.exists(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT + "/p")
HERE = os.path.dirname(os.path.abspath(__file__))


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
}


def ic(n, cls="ic"):
    return f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{IC[n]}</svg>'


# ---------- media ----------
def P(n, en, es):
    return (f"{n:02d}", en, es)


MEDIA = {
 "m_king": P(1, "Master bedroom: king bed", "Cuarto principal: cama king"),
 "m_full": P(19, "Master bedroom: full bed with trundle", "Cuarto principal: cama full con trundle"),
 "m_shower": P(6, "Master bath: shower and tub", "Baño principal: ducha y tina"),
 "m_toilet": P(7, "Master bath: toilet and bidet", "Baño principal: inodoro y bidet"),
 "m_vanity": P(9, "Master bath: double sink", "Baño principal: doble lavabo"),
 "m_towels": P(12, "Blue closet with towels", "Clóset azul con toallas"),
 "m_dryer": P(11, "Hair dryer drawer", "Gaveta de la secadora de pelo"),
 "q1_wide": P(44, "Queen room: two queen beds", "Cuarto queen: dos camas queen"),
 "q1_bed": P(41, "Queen room: bed made", "Cuarto queen: cama tendida"),
 "q1_tv": P(43, "Queen room: TV and dresser, centered", "Cuarto queen: TV y cómoda, centrada"),
 "din1": P(28, "Dining room", "Comedor"),
 "din2": P(29, "Dining table set", "Mesa del comedor puesta"),
 "k_oven": P(30, "Kitchen: oven, microwave, toaster", "Cocina: horno, microondas, tostadora"),
 "k_fridge": P(31, "Kitchen: fridge and counters", "Cocina: refrigerador y mostradores"),
 "k_sink": P(32, "Kitchen: sink", "Cocina: fregadero"),
 "k_bar": P(33, "Kitchen: bar and stove", "Cocina: barra y estufa"),
 "hb": P(35, "Half bath", "Medio baño"),
 "laun": P(23, "Laundry: washer, dryer, pool towels", "Lavandería: lavadora, secadora, toallas de piscina"),
 "g_arcade": P(25, "Game room: arcade", "Cuarto de juegos: arcade"),
 "g_pool": P(26, "Game room: pool table", "Cuarto de juegos: mesa de billar"),
 "g_sofa": P(27, "Game room: sofa", "Cuarto de juegos: sofá"),
 "g_tv": P(24, "Game room: TV and stairs", "Cuarto de juegos: TV y escaleras"),
 "l1": P(38, "Living room", "Sala"),
 "l2": P(39, "Living room: long sofa", "Sala: sofá largo"),
 "l3": P(40, "Living room: fireplace side", "Sala: lado de la chimenea"),
 "coffee": P(37, "Coffee station", "Estación de café"),
 "shelves": P(36, "Blue shelves", "Repisas azules"),
 "ka1": P(20, "Karaoke terrace", "Terraza de karaoke"),
 "ka2": P(21, "Karaoke terrace: sofa and neon wall", "Terraza de karaoke: sofá y pared de neón"),
 "u_q1": P(58, "Upstairs queen room", "Cuarto queen de arriba"),
 "u_q2": P(59, "Upstairs queen room: two beds", "Cuarto queen de arriba: dos camas"),
 "u_kid_tv": P(60, "Kids room: TV wall", "Cuarto de niños: pared del TV"),
 "u_kid_bunk": P(61, "Kids room: bunk bed", "Cuarto de niños: litera"),
 "u_bath1": P(64, "Upstairs bath: shower", "Baño de arriba: ducha"),
 "u_bath2": P(63, "Upstairs bath: two sinks", "Baño de arriba: dos lavabos"),
 "u_bath3": P(62, "Upstairs bath: toilet", "Baño de arriba: inodoro"),
 "u_bunk": P(66, "Bunk bed with trundle", "Litera con trundle"),
 "u_curt": P(65, "Room with the black-curtain door", "Cuarto con la puerta de cortina negra"),
 "mez": P(57, "Montessori play area", "Zona de juegos Montessori"),
 "r1": P(53, "Fan remote 1 of 4", "Control del ventilador 1 de 4"),
 "r2": P(54, "Fan remote 2 of 4", "Control del ventilador 2 de 4"),
 "r3": P(55, "Fan remote 3 of 4", "Control del ventilador 3 de 4"),
 "r4": P(56, "Fan remote 4 of 4", "Control del ventilador 4 de 4"),
}
used = set()


def gallery(ids):
    used.update(ids)
    cells = []
    for m in ids:
        f, cen, ces = MEDIA[m]
        cells.append(
            f'<figure class="cell"><button class="thumb" type="button" data-kind="photo" data-src="{PREFIX}p/{f}.jpg" '
            f'data-poster="" data-cap-en="{html.escape(cen, True)}" data-cap-es="{html.escape(ces, True)}" '
            f'aria-label="{html.escape(cen, True)}"><img src="{PREFIX}p/{f}-t.jpg" alt="" loading="lazy" decoding="async" draggable="false">'
            f'</button><figcaption>{T(cen, ces)}</figcaption></figure>')
    return '<div class="gallery strip">' + "".join(cells) + '</div>'


# ---------- components ----------
def ck(en, es):
    return (f'<div class="li"><span class="dot">{ic("check", "tick")}</span>'
            f'<span class="ck-t">{T(en, es)}</span></div>')


def ctr(key, target, en, es, icon="towel", tone=""):
    return (f'<div class="ctr {tone}"><span class="ctr-ic2">{ic(icon, "ic ctr-ic")}</span>'
            f'<span class="ctr-n"><b>{target}</b></span>'
            f'<span class="ctr-l">{T(en, es)}</span></div>')


def chips(*pairs):
    return '<div class="lchips">' + "".join(f'<span class="lchip {c}">{T(a, b)}</span>' for a, b, c in pairs) + '</div>'


def zone(zid, icon, en, es, tone, media, items, counters=(), extra=""):
    cs = f'<div class="ctrs">{"".join(counters)}</div>' if counters else ""
    ex = extra
    return (f'<section class="zone {tone}" id="{zid}"><div class="zhead"><span class="zic">{ic(icon, "ic")}</span>'
            f'<h3>{T(en, es)}</h3></div>'
            f'<div class="zbody">{gallery(media) if media else ""}{ex}{cs}'
            f'<div class="cks">{"".join(ck(a, b) for a, b in items)}</div></div></section>')


def alert(icon, en, es, body_en, body_es, extra=""):
    return (f'<div class="acard">{"<span class=aic>" + ic(icon, "ic") + "</span>"}<div class="abody"><h3>{T(en, es)}</h3>'
            f'<p>{T(body_en, body_es)}</p>{extra}</div></div>')


def bedcard(icon, tone, en, es, where_en, where_es, layers, note=None):
    lay = "".join(f'<span class="layer {c}">{T(a, b)}</span>' for a, b, c in layers)
    nt = f'<p class="bnote">{T(*note)}</p>' if note else ""
    return (f'<div class="bed {tone}"><div class="bhead">{ic(icon, "ic")}<div><h4>{T(en, es)}</h4>'
            f'<p class="bwhere">{T(where_en, where_es)}</p></div></div><div class="layers">{lay}</div>{nt}</div>')


L_FIT = ("Fitted", "Sábana ajustable", "l-on")
L_FLAT = ("Flat sheet", "Sábana plana", "l-on")
L_DUV = ("Duvet", "Duvet", "l-on")
L_PIL = ("Decor pillows", "Almohadas decorativas", "l-on")
L_NODUV = ("No duvet", "Sin duvet", "l-off")
L_ROLL = ("Duvet rolled at the foot", "Duvet enrollado a los pies", "l-fold")
L_FOLD = ("Duvet folded", "Duvet doblado", "l-fold")

# ---------- content ----------
START = f'''<section class="card start" id="start"><h2 class="ch">{ic("camera", "ic")}{T("1 · Start here", "1 · Empieza aquí")}</h2>
<p class="lead">{T("Before you clean anything:", "Antes de limpiar nada:")}</p>
<div class="cks">{ck("Walk the whole house. Photograph anything damaged, dirty or missing.", "Recorre toda la casa. Toma fotos de lo que esté dañado, sucio o faltante.")}
{ck("Damage: report it to Andrés right away.", "Daños: avísale a Andrés de inmediato.")}
{ck("Send your before photos to this property's WhatsApp group.", "Manda tus fotos de antes al grupo de WhatsApp de esta propiedad.")}</div></section>'''

FAN_REMOTES = alert("wind", "4 fan remotes on the wall", "4 controles de ventiladores en la pared",
                    "Four white remotes. Every one must be back on its wall holder. Very important.",
                    "Cuatro controles blancos. Todos deben quedar en su soporte de la pared. Muy importante.",
                    f'<div class="ctrs one">{ctr("remotes", 4, "Remotes on the wall", "Controles en la pared", "wind", "tone-alert")}</div>' + gallery(["r1", "r2", "r3", "r4"]))
ALERTS = f'''<section class="card alerts" id="musts"><h2 class="ch">{ic("alert", "ic")}{T("Must-do rules", "Reglas obligatorias")}</h2>
{alert("temp", "Thermostat 76°F", "Termostato a 76°F", "Before you leave, set the house thermostat to 76°F. It is in the master bedroom.", "Antes de irte, deja el termostato de la casa en 76°F. Está en el cuarto principal.")}
{FAN_REMOTES}
{alert("drop", "White floors: wash the mop cloth", "Pisos blancos: lava el trapo", "Floors are white and show dirt. Use clean mop cloths. Rinse the cloth again and again: after the living room, the dining room and every room.", "Los pisos son blancos y se ve la suciedad. Usa trapos limpios. Lava el trapo una y otra vez: después de la sala, del comedor y de cada cuarto.")}
</section>'''

BEDS = f'''<section class="card" id="beds"><h2 class="ch">{ic("bed", "ic")}{T("Bed guide", "Guía de camas")}</h2>
<p class="lead">{T("Make every bed to match the photos.", "Tiende cada cama igual que las fotos.")}</p>
{bedcard("bed", "b1", "Duvet beds", "Camas con duvet", "Master king · master full · both 2-queen rooms", "Principal king · principal full · los dos cuartos con 2 queen", [L_FIT, L_FLAT, L_DUV, L_PIL])}
{bedcard("layers", "b2", "Trundle (master)", "Trundle (principal)", "Rolls out under the full bed", "Sale por debajo de la cama full", [L_FIT, L_FLAT, L_NODUV])}
{bedcard("layers", "b3", "Bunk bed · kids room", "Litera · cuarto de niños", "Kids don't use the duvet", "Los niños no usan el duvet", [L_FIT, L_FLAT, L_ROLL])}
{bedcard("layers", "b4", "Bunk + trundle room", "Cuarto con litera + trundle", "Upstairs, next to the play area", "Arriba, junto a la zona de juegos", [L_FIT, L_FLAT, L_FOLD], ("Bunk: duvet folded. Trundle: flat + fitted only. Leave the gray blanket in the room.", "Litera: duvet doblado. Trundle: solo plana + ajustable. Deja la cobija gris en el cuarto."))}
</section>'''

Z1 = [
 zone("dining", "pot", "Dining room", "Comedor", "t1", ["din1", "din2"],
      [("8 seats set with napkins and hot-plate placemats. It is decor: leave it set.", "8 lugares con servilletas y manteles individuales. Es decoración: déjalo puesto."),
       ("Sweep and mop.", "Barrer y trapear.")]),
 zone("master", "bed", "Master suite", "Cuarto principal", "t1", ["m_king", "m_full", "m_vanity", "m_shower", "m_toilet", "m_towels", "m_dryer"],
      [("King bed: duvet and decor pillows, like the photo.", "Cama king: duvet y almohadas decorativas, como la foto."),
       ("Full bed: duvet and decor pillows. Trundle underneath: flat + fitted only.", "Cama full: duvet y almohadas decorativas. Trundle abajo: solo plana + ajustable."),
       ("Master bath: clean glass shower (with hose), tub, double sink, toilet, bidet.", "Baño principal: limpia ducha de vidrio (con manguera), tina, doble lavabo, inodoro, bidet."),
       ("Soap, shampoo and conditioner full. Refill if low.", "Jabón, champú y acondicionador llenos. Rellena si hay poco."),
       ("Towels come from the blue closet in the bath. Leave the exact count shown.", "Las toallas salen del clóset azul del baño. Deja la cantidad exacta que se indica."),
       ("Quick look at the small covered terrace (exit from the master bath).", "Revisa la terraza techada pequeña (salida del baño principal)."),
       ("Supplies closet is in the hallway. Everything is labeled. The code comes in your assignment email.", "El clóset de suministros está en el pasillo. Todo está etiquetado. El código viene en tu correo de asignación.")],
      [ctr("m-bath", 4, "Bath towels", "Toallas grandes"), ctr("m-wash", 4, "Washcloths", "Washcloths"), ctr("m-hand", 1, "Hand towel hung", "Toalla de mano colgada")]),
 zone("halfbath", "drop", "Half bath", "Medio baño", "t1", ["hb"],
      [("Clean sink, toilet and floor.", "Limpia lavabo, inodoro y piso."),
       ("One hand towel, hung.", "Una toalla de mano, colgada.")],
      [ctr("hb-hand", 1, "Hand towel hung", "Toalla de mano colgada")]),
 zone("queen1", "bed", "Queen room · 2 queens", "Cuarto de 2 queen", "t1", ["q1_wide", "q1_bed", "q1_tv"],
      [("Both queen beds: duvet and decor pillows, like the photos.", "Las dos camas queen: duvet y almohadas decorativas, como las fotos."),
       ("Nightstand lined up with the two Matisse pictures.", "La mesa de noche alineada con los dos cuadros de Matisse."),
       ("Dresser perfectly centered under the TV.", "La cómoda perfectamente centrada debajo del TV."),
       ("Curtains and blinds open so the sun comes in.", "Cortinas y persianas abiertas para que entre el sol."),
       ("December and January: close the curtains so they look fully yellow.", "Diciembre y enero: cierra las cortinas para que se vean completamente amarillas.")]),
 zone("kitchen", "pot", "Kitchen", "Cocina", "t1", ["k_oven", "k_fridge", "k_sink", "k_bar"],
      [("Counters clean and everything in order.", "Mostradores limpios y todo en orden."),
       ("Silverware organized.", "Cubiertos organizados."),
       ("Same glasses together.", "Los vasos iguales juntos."),
       ("Electric stove and toaster clean.", "Estufa eléctrica y tostadora limpias."),
       ("The dark stain on the granite bar was already there. Do not worry about it.", "La mancha oscura en el granito de la barra ya estaba ahí. No te preocupes por ella.")]),
 zone("laundry", "wash", "Laundry", "Lavandería", "t1", ["laun"],
      [("Wash on the Quick cycle.", "Lava en el ciclo Quick (rápido)."),
       ("Black cabinets: leave 16 pool towels.", "Gabinetes negros: deja 16 toallas de piscina.")],
      [ctr("pool", 16, "Pool towels", "Toallas de piscina", "towel")]),
 zone("game", "play", "Game room", "Cuarto de juegos", "t1", ["g_arcade", "g_pool", "g_sofa", "g_tv"],
      [("Pool table always set up and ready.", "Mesa de billar siempre armada y lista."),
       ("Sofa, arcade and TV tidy.", "Sofá, arcade y TV en orden."),
       ("Sweep and mop.", "Barrer y trapear.")]),
 zone("living", "coffee", "Living room", "Sala", "t1", ["l1", "l2", "l3", "coffee", "shelves"],
      [("Pillows in the same pattern as the photos.", "Almohadas con el mismo patrón de las fotos."),
       ("Coffee station set up, like the photo.", "Estación de café armada, como la foto."),
       ("Sweep and mop very well, with clean mop cloths.", "Barrer y trapear muy bien, con trapos limpios.")]),
 zone("karaoke", "mic", "Karaoke terrace", "Terraza de karaoke", "t3", ["ka1", "ka2"],
      [("Up the metal stairs from the dining room.", "Se sube por las escaleras de metal del comedor."),
       ("Karaoke speaker and microphones stay here.", "El parlante y los micrófonos del karaoke se quedan aquí."),
       ("Neon sign on the wall: “Singin’ in San Antonio”.", "Letrero de neón en la pared: “Singin’ in San Antonio”."),
       ("Sweep and mop.", "Barrer y trapear.")]),
]

Z2 = [
 zone("u-queen", "bed", "Queen room · 2 queens + TV", "Cuarto de 2 queen + TV", "t2", ["u_q1", "u_q2"],
      [("Both queen beds: regular duvet and decor pillows, like the photos.", "Las dos camas queen: duvet normal y almohadas decorativas, como las fotos."),
       ("TV in place and room tidy.", "TV en su lugar y cuarto en orden."),
       ("Sweep and mop.", "Barrer y trapear.")]),
 zone("u-kids", "star", "Kids room · bunk bed", "Cuarto de niños · litera", "t2", ["u_kid_bunk", "u_kid_tv"],
      [("Bunk bed: fitted + flat. Duvet rolled up at the foot.", "Litera: ajustable + plana. Duvet enrollado a los pies."),
       ("Sweep and mop.", "Barrer y trapear.")]),
 zone("u-bath", "drop", "Upstairs bath", "Baño de arriba", "t2", ["u_bath1", "u_bath2", "u_bath3"],
      [("Clean glass shower, two sinks and toilet.", "Limpia ducha de vidrio, dos lavabos e inodoro."),
       ("Second floor sleeps 8: leave 8 large towels and 8 washcloths.", "El segundo piso aloja 8 personas: deja 8 toallas grandes y 8 washcloths.")],
      [ctr("u-bath", 8, "Large towels", "Toallas grandes"), ctr("u-wash", 8, "Washcloths", "Washcloths")]),
 zone("u-bunk", "bed", "Bunk + trundle room", "Cuarto litera + trundle", "t2", ["u_bunk", "u_curt"],
      [("Bunk: duvet folded. Trundle underneath: flat + fitted only.", "Litera: duvet doblado. Trundle abajo: solo plana + ajustable."),
       ("Gray blanket stays in the room.", "La cobija gris se queda en el cuarto."),
       ("Door with the black curtain leads to the play area.", "La puerta con la cortina negra lleva a la zona de juegos."),
       ("Sweep and mop.", "Barrer y trapear.")]),
 zone("u-play", "star", "Montessori play area", "Zona de juegos Montessori", "t2", ["mez"],
      [("Check it is clean.", "Revisa que esté limpia."),
       ("No diapers left behind.", "Sin pañales olvidados."),
       ("Nothing broken.", "Nada roto."),
       ("The 4 white fan remotes are on the wall (see Must-do rules).", "Los 4 controles blancos de ventiladores están en la pared (ver Reglas obligatorias)."),
       ("Sweep and mop.", "Barrer y trapear.")]),
]

FINISH = f'''<section class="card finish" id="finish"><h2 class="ch">{ic("video", "ic")}{T("Before you leave", "Antes de irte")}</h2>
<div class="cks">
{ck("Thermostat set to 76°F.", "Termostato en 76°F.")}
{ck("4 fan remotes on the wall.", "4 controles de ventiladores en la pared.")}
{ck("Karaoke speaker and microphones in place.", "Parlante y micrófonos del karaoke en su lugar.")}
{ck("Pool table set up. Coffee station set up.", "Mesa de billar armada. Estación de café armada.")}
{ck("Pool towels: 16 in the black cabinets.", "Toallas de piscina: 16 en los gabinetes negros.")}
{ck("Trash out. Pickup days: Tuesday and Friday.", "Basura afuera. Días de recolección: martes y viernes.")}
</div>
<h3 class="sub2">{ic("video", "ic")}{T("Final video", "Video final")}</h3>
<div class="cks">
{ck("Your final product is one video of the whole house, with the date and time on screen (timestamp camera app).", "El producto final es un video de toda la casa, con la fecha y la hora visibles en pantalla (app de cámara con timestamp).")}
{ck("Go zone by zone, slowly: floor 1, then floor 2, terraces and game room. Every room and every bathroom.", "Ve zona por zona, despacio: piso 1 y luego piso 2, las terrazas y el cuarto de juegos. Cada cuarto y cada baño.")}
{ck("Open the drawers.", "Abre los cajones.")}
{ck("Test the TVs: show that they turn on.", "Prueba los televisores: muestra que prenden.")}
{ck("Zoom in on the special areas: the coffee station, where the trash bags are, where the toilet paper is, and the number of towels.", "Enfoca bien las zonas especiales: la zona del café, donde están las bolsas de basura, donde están los papeles higiénicos y la cantidad de toallas.")}
{ck("Show any other extra detail there is.", "Muestra cualquier otro detalle extra que exista.")}
{ck("Send the video to this property's WhatsApp group.", "Envía el video al grupo de WhatsApp de esta propiedad.")}
{ck("Report anything broken or missing to Andrés.", "Reporta a Andrés lo que esté roto o falte.")}
</div>

</section>'''

GLANCE = f'''<section class="glance" aria-label="{html.escape("At a glance")}">
<div class="tile"><b>5</b><span>{T("Bedrooms", "Cuartos")}</span></div>
<div class="tile"><b>2.5</b><span>{T("Baths", "Baños")}</span></div>
<div class="tile"><b>8</b><span>{T("Sleep upstairs", "Duermen arriba")}</span></div>
<div class="tile hot"><b>76°F</b><span>{T("Final temp", "Temp. final")}</span></div>
</section>
<section class="towelrow" aria-label="Towels"><h2 class="mini">{ic("towel", "ic")}{T("Towel counts", "Cantidad de toallas")}</h2><div class="tw">
<a href="#master"><b>4</b><span>{T("Master bath", "Baño principal")}</span><i>{T("+ 4 washcloths", "+ 4 washcloths")}<br>{T("+ 1 hand towel", "+ 1 toalla de mano")}</i></a>
<a href="#u-bath"><b>8</b><span>{T("Upstairs bath", "Baño de arriba")}</span><i>{T("+ 8 washcloths", "+ 8 washcloths")}</i></a>
<a href="#laundry"><b>16</b><span>{T("Pool towels", "Toallas de piscina")}</span><i>{T("black cabinets", "gabinetes negros")}</i></a>
</div></section>'''

NAV = [("start", "Start", "Inicio"), ("beds", "Beds", "Camas"), ("floor1", "Floor 1", "Piso 1"), ("floor2", "Floor 2", "Piso 2"), ("finish", "Finish", "Final")]
nav = "".join(f'<a class="chip" href="#{i}">{T(a, b)}</a>' for i, a, b in NAV)

CSS = open(os.path.join(HERE, "sop.css"), encoding="utf-8").read() + "\n" + open(os.path.join(HERE, "sop2.css"), encoding="utf-8").read()
JS = open(os.path.join(HERE, "sop.js"), encoding="utf-8").read() 

# placement check + asset copy
body_main = (GLANCE + START + ALERTS + BEDS +
             f'<div class="floorhead" id="floor1"><span class="fl">1</span><h2>{T("Floor 1", "Piso 1")}</h2></div>' + "".join(Z1) +
             f'<div class="floorhead f2" id="floor2"><span class="fl">2</span><h2>{T("Floor 2", "Piso 2")}</h2></div>' + "".join(Z2) +
             FINISH)
unplaced = set(MEDIA) - used
assert not unplaced, unplaced
PH = os.environ.get("MORSE_PHOTOS", "/tmp/claude-0/-home-claude/b8672685-141b-5f7b-b10d-94381756def9/scratchpad/morse-photos/")
for m in sorted(used):
    f = MEDIA[m][0]
    shutil.copy(PH + f"{f}.jpg", OUT + f"/p/{f}.jpg")
    shutil.copy(PH + f"{f}-t.jpg", OUT + f"/p/{f}-t.jpg")

shutil.copy(os.path.join(S, "house", "morsehead.jpg"), OUT + "/p/house.jpg")
HERO = (f'<div class="wrap"><figure class="hero"><img src="{PREFIX}p/house.jpg" alt="" decoding="async" draggable="false">'
        f'<figcaption>{T("This is the house", "Esta es la casa")}</figcaption></figure></div>')
DRAFT = "" if PROD else ('<div class="draft"><div class="wrap">' + T("Draft preview for review. The published version will sit behind email verification.", "Borrador para revisión. La versión publicada estará protegida con verificación por correo.") + '</div></div>')
page = f'''<meta charset="utf-8"><title>{"SOP" if PROD else "Morsehead SOP"}</title>
<meta name="robots" content="noindex, nofollow"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Manrope:wght@400;500;700&display=swap">
<style>
{CSS}
</style>

<header class="top">
  <div class="wrap">
    <p class="eyebrow">Chabod Cleaning Services &middot; {T("Standard operating procedure", "Procedimiento estándar")}</p>
    <h1>Morsehead</h1>
    <p class="addr">1818 Moreshead St, San Antonio, TX</p>
  </div>
</header>
{HERO}
{DRAFT}

<div class="bar" role="navigation" aria-label="Sections">
  <div class="wrap barrow">
    <div class="lang" role="group" aria-label="Language">
      <button type="button" data-lang="en" aria-pressed="false">EN</button>
      <button type="button" data-lang="es" aria-pressed="false">ES</button>
    </div>
    <nav class="chips">{nav}</nav>
  </div>
</div>

<main class="wrap main">
{body_main}
<p class="note">{T("Door codes are sent with your assignment email. They are not on this page.", "Los códigos de las puertas se envían en el correo de asignación. No están en esta página.")}</p>
</main>
<footer class="foot"><div class="wrap">Chabod Cleaning Services &middot; {T("Last updated", "Actualizado")} 2026-10-26</div></footer>

<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Media viewer">
  <button class="lb-close" type="button" aria-label="Close">&times;</button>
  <button class="lb-nav lb-prev" type="button" aria-label="Previous"><span aria-hidden="true"></span></button>
  <div class="lb-stage" id="lbstage"></div>
  <button class="lb-nav lb-next" type="button" aria-label="Next"><span aria-hidden="true"></span></button>
  <div class="lb-cap"><span id="lbcap"></span> <span class="lb-count" id="lbcount"></span></div>
</div>

<script>
{JS}
</script>
'''
open(OUT + "/index.html", "w", encoding="utf-8").write(page)
print("built", len(page), "bytes;", len(used), "media placed ->", OUT)
