#!/usr/bin/env python3
"""Visual SOP page for Post Avenue (design guide: GUIA-DISENO-SOP.md; reference: build_morse.py).
Content comes from post_content.py (same facts, same EN/ES wording, split into short lines per room).
Photos already live in worker/public/<CODE>/p. NO door / closet / casita codes on this page.
Run: python -I build_post2.py <package dir>      -> worker/public/<CODE>/index.html + post_items.sql"""
import os, shutil, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sop_lib as L
from sop_lib import T, ic, PH

S = sys.argv[1]
CODE = "d4fb287aae3540b6"
PAGE_ID = "8d6a61f2-6f93-42e4-a370-e8e8c70e9bc3"
OUT = os.path.join(S, "worker", "public", CODE)

MEDIA = {
 "03": PH("03", "Wall (Murphy) bed made up", "Cama Murphy (de pared) armada"),
 "04": PH("04", "Arc lamp and sheer curtains", "Lámpara en arco y cortinas de velo"),
 "05": PH("05", "Thermostat set to 77°F", "Termostato en 77°F"),
 "06": PH("06", "Music area", "Zona de música"),
 "07": PH("07", "Office room: queen bed with towels", "Cuarto oficina: cama queen con toallas"),
 "09": PH("09", "TV and Wi-Fi sign (check that the TV turns on)", "TV y letrero del Wi-Fi (probar que el TV prenda)"),
 "10": PH("10", "Lock on an outside door", "Chapa de una puerta de afuera"),
 "11": PH("11", "Kitchen sink: soaps and a new sponge", "Sink de la cocina: jabones y esponja nueva"),
 "12": PH("12", "Kitchen towel on the dishwasher", "Toalla de cocina en el lavaplatos"),
 "13": PH("13", "Coffee station: K-Cups, creamers, sugar and tea", "Estación de café: K-Cups, creamers, azúcar y té"),
 "14": PH("14", "Coffee station: Keurig, coffee maker and grinder", "Estación de café: Keurig, cafetera y molino"),
 "15": PH("15", "Living room cushions, standard setup (1)", "Cojines de la sala, estándar (1)"),
 "16": PH("16", "Living room cushions, standard setup (2)", "Cojines de la sala, estándar (2)"),
 "17": PH("17", "Living room fireplace", "Chimenea de la sala"),
 "18": PH("18", "Sink: makeup towel and hand towel", "Sink: toalla de make-up y toalla de manos"),
 "19": PH("19", "Queen bed, green headboard", "Cama queen, cabecera verde"),
 "20": PH("20", "Queen bed, white comforter", "Cama queen, comforter blanco"),
 "21": PH("21", "Floor 2 main king bed, 2 green pillows centered", "Cama king principal del piso 2, 2 cojines verdes centrados"),
 "22": PH("22", "Queen bed, tufted comforter", "Cama queen, comforter texturizado"),
 "23": PH("23", "King bed, white comforter", "Cama king, comforter blanco"),
 "26": PH("26", "Queen bed, white comforter and 2 square pillows", "Cama queen, comforter blanco y 2 cojines cuadrados"),
 "28": PH("28", "Bathroom sink and mirror", "Sink y espejo de un baño"),
 "30": PH("30", "Casita queen bed", "Cama queen de la casita"),
 "32": PH("32", "Bathroom with shower curtain (casita)", "Baño con cortina de ducha (casita)"),
 "34": PH("34", "Towel set for every bed: 2 large towels, 1 hand towel, 2 washcloths",
          "Set de toallas de cada cama: 2 toallas grandes, 1 de manos, 2 washcloths"),
}
L.init(CODE, MEDIA)

# ---------- 1 · Start here ----------
SEC = "Start here"
START = L.card("start", "camera", "1 · Start here", "1 · Empieza aquí",
               f'<p class="lead">{T("Before you clean anything:", "Antes de limpiar nada:")}</p>' +
               L.cklist(SEC, [
                   ("Walk the whole house. Photograph every floor, room, bathroom, the kitchen, the casita and the outdoor area, as you found them.",
                    "Recorre toda la casa. Toma fotos de cada piso, cuarto, baño, la cocina, la casita y el área de afuera, tal como los encontraste."),
                   ("Damage (broken, stained, missing, out of place): take clear photos and tell Andrés right away.",
                    "Daños (algo roto, manchado, faltante o fuera de lugar): toma fotos claras y avísale a Andrés de inmediato."),
                   ("Send all photos to this property's WhatsApp group.",
                    "Envía todas las fotos al grupo de WhatsApp de esta propiedad."),
               ]), cls="card start")

# ---------- Must-do rules (house-wide) ----------
SEC = "Must-do rules"
OLD_EN = ("Very old house: the windows are not airtight and the A/C struggles to cool it. That is why these rules matter. "
          "The owner tells guests the house may be warmer than a modern home.")
OLD_ES = ("Casa muy vieja: las ventanas no son herméticas y el aire acondicionado batalla para bajar la temperatura. "
          "Por eso estas reglas son tan importantes. El dueño le avisa a los huéspedes que la casa puede estar más caliente que una casa moderna.")
L._rec_text(SEC, "Old house", OLD_EN, OLD_ES)
ALERTS = L.card("musts", "alert", "Must-do rules", "Reglas obligatorias",
                f'<p class="lead">{T(OLD_EN, OLD_ES)}</p>' +
                L.alert(SEC, "temp", "A/C at 77, mini splits OFF", "Aire en 77, mini splits APAGADOS",
                        [("Thermostat A/C units: always 77°F. Mini splits (the units high on the wall): ALL OFF, no exceptions.",
                          "Aires de termostato: siempre en 77°F. Mini splits (los aparatos arriba en la pared): TODOS APAGADOS, sin excepción."),
                         ("Thermostat panels: one at the exit of the master suite, in front of the music area; one on floor 2, behind the stairs (back to the stairs when you come up).",
                          "Paneles de termostato: uno a la salida del máster, frente a la zona de música; otro en el piso 2, detrás de las escaleras (dándole la espalda a las escaleras cuando subes)."),
                         ("The mini split in the casita, by the door, stays OFF too.",
                          "El mini split de la casita, junto a la puerta, también queda APAGADO.")],
                        [("77°F", "Thermostats", "Termostatos", "temp", ""), ("OFF", "Mini splits", "Mini splits", "wind", "tone-alert")],
                        ["05"]) +
                L.alert(SEC, "lock", "Outside doors closed and locked", "Puertas de afuera cerradas y aseguradas",
                        [("Every door that leads outside must be closed and locked when you leave.",
                          "Todas las puertas que dan hacia afuera deben quedar cerradas y aseguradas al salir."),
                         ("The final video must clearly show you closing and locking them.",
                          "El video final tiene que mostrar claramente cómo las cierras y las aseguras.")],
                        media=["10"]) +
                L.alert(SEC, "layers", "Curtains closed", "Cortinas cerradas",
                        [("Curtains closed in every room, the white sheer ones and the regular ones, to keep the cool air inside.",
                          "Cortinas cerradas en todos los cuartos, las de velo blanco y las normales, para conservar el aire fresco adentro."),
                         ("Hang them even and neat.", "Déjalas parejas y ordenadas.")]) +
                L.alert(SEC, "bulb", "Lights OFF", "Luces APAGADAS",
                        [("All lights OFF, always.", "Todas las luces APAGADAS, siempre."),
                         ("Only exception: a check-in the same day. Then leave the purple light ON.",
                          "Única excepción: si hay una reservación que entra el mismo día, deja encendida la luz morada.")]),
                cls="card alerts")

# ---------- Bed guide ----------
SEC = "Bed guide"
BEDS = L.card("beds", "bed", "Bed guide", "Guía de camas",
              f'<p class="lead">{T("Every bed and the towels on top: make them to match the photos.", "Cada cama y las toallas encima: igual que las fotos.")}</p>' +
              L.bedcard(SEC, "bed", "b1", "Every bed", "Todas las camas",
                        "All bedrooms, floor 1, floor 2 and the casita", "Todos los cuartos, piso 1, piso 2 y la casita",
                        [L.L_FIT, L.L_FLAT, ("Comforter", "Comforter", "l-on")],
                        ("Fold the flat sheet over so it wraps the comforter and protects it. Tuck it in on all sides.",
                         "La flat se dobla para abrazar el comforter y cuidarlo, y se mete por todos los lados.")) +
              L.bedcard(SEC, "towel", "b2", "Towels on top of every bed", "Toallas encima de cada cama",
                        "Perfectly folded, fluffy and inviting. See the reference photo.",
                        "Perfectamente dobladas, mullidas y que se vean inviting. Ver la foto de referencia.",
                        [("2 large towels", "2 toallas grandes", "l-on"), ("1 hand towel", "1 toalla de manos", "l-on"),
                         ("2 washcloths", "2 washcloths", "l-on")]) +
              L.gallery(["34", "23", "26", "22", "19", "20", "03"], SEC))

# ---------- House-wide: all bathrooms ----------
Z0 = [
 L.zone("bathrooms", "drop", "All bathrooms", "Todos los baños", "t3", ["18", "28"],
        [("Hand towel and makeup towel on the sink. The guest towels go on the beds.",
          "Toalla de manos y toalla de make-up en el sink. Las toallas de los huéspedes van en las camas."),
         ("Toilet paper: 1 roll hung on the holder, 2 new rolls stored in the bathroom.",
          "Papel higiénico: 1 colgado y 2 nuevos guardados en el baño."),
         ("Soap dispensers filled.", "Jabones llenos."),
         ("Glass with no water marks.", "Vidrios sin marcas de agua."),
         ("Sweep and mop. Check that nothing is left behind.", "Barre y trapea. Revisa que no quede nada olvidado.")],
        [(1, "Hand towel on the sink", "Toalla de manos en el sink", "towel", ""),
         (1, "Makeup towel on the sink", "Toalla de make-up en el sink", "towel", ""),
         (1, "Roll hung", "Rollo colgado", "check", ""),
         (2, "New rolls stored", "Rollos nuevos guardados", "check", "")]),
]

# ---------- Floor 1 ----------
Z1 = [
 L.zone("office", "bed", "Office room", "Cuarto oficina", "t1", ["04", "07"],
        [("First room on your left as you enter.", "Primer cuarto a mano izquierda al entrar."),
         ("Queen bed that also works as an office.", "Cama queen que también funciona como oficina."),
         ("Arc lamp and the orange curtains.", "Lámpara en arco y cortinas naranjas."),
         ("Make the bed to the standard, towels on top, curtains closed.", "Haz la cama al estándar, toallas encima, cortinas cerradas.")]),
 L.zone("music", "mic", "Music area", "Zona de música", "t1", ["06"],
        [("After the office, going clockwise: a music station.", "Después de ese cuarto, en sentido de las manecillas del reloj: una estación de música."),
         ("Clean it and leave it neat and well organized.", "Límpiala y déjala bien ordenada."),
         ("Match the reference photo.", "Iguala la foto de referencia.")]),
 L.zone("master", "bed", "Master suite", "Suite máster", "t1", [],
        [("Closet with gray doors at the entrance to the master: all the extra folded laundry used to make up the beds while the dirty laundry is washed. Keep it organized.",
          "Closet de puertas grises en la entrada al máster: todo el laundry extra doblado para armar las camas mientras se lava lo sucio. Mantenlo ordenado."),
         ("King bed, TV and an exercise bike. Very large closet.", "Cama king, televisor y una bicicleta estática. Closet grandísimo."),
         ("Wood floor: sweep and mop. Vacuum the decorative rugs.", "Piso de madera: barre y trapea. Aspira las alfombras decorativas."),
         ("Test that the TV turns on.", "Prueba que el televisor prenda.")],
        notes=[("The Louis Vuitton boxes in the closet are decoration: do NOT throw them away.",
                "Las cajas de Louis Vuitton del closet son decoración: NO se botan.")]),
 L.zone("master-bath", "drop", "Master bathroom", "Baño del máster", "t1", [],
        [("Double shower, tub and an electric smart toilet.", "Ducha doble, tina e inodoro eléctrico inteligente."),
         ("Toilet paper: 2 stored below and 1 hung.", "Papel higiénico: 2 guardados abajo y 1 colgado."),
         ("Makeup towel and hand towel on the sink. The guest towels go on the bed.",
          "Toalla de make-up y toalla de manos en el sink. Las toallas de los huéspedes van en la cama."),
         ("Soaps filled.", "Jabones llenos.")],
        notes=[("The smart toilet flushes slowly: wait a moment and do not get frustrated. Do NOT unplug or reconnect it.",
                "El inodoro inteligente demora en hacer flush: espera un momento y no te desesperes. NO lo desconectes ni lo vuelvas a conectar.")]),
 L.zone("sitting", "tv", "Small sitting room", "Salita", "t1", [],
        [("Leaving the master: a small sitting room with a TV and a sofa.", "Saliendo del máster: una salita con un televisor y un sofá."),
         ("Match the reference photos.", "Iguala las fotos de referencia."),
         ("Make sure the TV turns on.", "Asegura que el televisor prenda.")]),
 L.zone("kitchen", "pot", "Kitchen", "Cocina", "t1", ["11", "12"],
        [("Refill the soaps. Always leave a NEW sponge.", "Rellena los jabones. Deja siempre una esponja NUEVA."),
         ("Under the sink: trash bags, dishwasher pods and the rest of the supplies. New paper towel roll on top.",
          "Debajo del sink: bolsas de basura, pods del dishwasher y los demás suministros. Paper towel nuevo encima."),
         ("Leave the dishwasher EMPTY.", "Deja el dishwasher VACÍO."),
         ("Leave the fridge EMPTY, with only baking soda for odors.", "Deja la nevera VACÍA, solo con el baking soda para los olores."),
         ("Clean the windows very well with a duster. Lots of cobwebs build up there.",
          "Limpia muy bien las ventanas con un plumero. Ahí se acumulan muchas telarañas.")],
        notes=[("The owner leaves condiments on top of a shelf: they stay there.",
                "El dueño deja condimentos encima de una repisa: ahí se quedan."),
               ("They are historic windows.", "Son ventanas históricas.")]),
 L.zone("laundry", "wash", "Laundry and dog wash", "Lavandería y baño del perro", "t1", [],
        [("Behind the refrigerator: the laundry area, with the washer and dryer.", "Detrás del refrigerador: la zona de lavandería con la lavadora y la secadora."),
         ("The owner leaves extra paper products and some cleaning supplies here.", "El dueño deja aquí papeles extra y algunos suministros de limpieza."),
         ("Dog wash station: make sure it is clean and free of dirt.", "Estación para bañar perros: asegura que quede limpia y libre de mugre."),
         ("If dogs were at the property, document it with photos and report it.", "Si hubo perros en la propiedad, documéntalo con fotos y repórtalo.")]),
 L.zone("dining", "pot", "Dining room and bar", "Comedor y bar", "t1", [],
        [("Lots of glass: clean all the glass.", "Hay bastantes vidrios: limpia todos los vidrios."),
         ("Bar station: no dust and no used glasses.", "Estación del bar: sin polvo y sin copas usadas.")]),
 L.zone("coffee", "coffee", "Coffee station", "Estación de café", "t1", ["13", "14"],
        [("Leave it very well stocked. The house sleeps up to 18 guests: it cannot look empty.",
          "Déjala muy bien surtida. La casa aloja hasta 18 personas: no puede verse vacía."),
         ("Coffee for the grinder (there is a coffee grinder).", "Café para moler (hay un molino de café)."),
         ("Disposable cups, creamers and sugar, all full.", "Vasos desechables, creamers y azúcar, todo lleno.")],
        [(10, "Keurig K-Cups, at least", "K-Cups de la Keurig, mínimo", "coffee", "")]),
 L.zone("halfbath", "drop", "Half bath", "Medio baño", "t1", [],
        [("Toilet paper in place and clean, as in every bathroom.", "Papel higiénico en su lugar, limpio, igual que en todos los baños."),
         ("Turn off all the lights.", "Apaga todas las luces.")]),
 L.zone("living", "tv", "Living room", "Sala", "t1", ["15", "16", "17"],
        [("Leave the cushions exactly as in the reference photo. That is the standard.",
          "Deja los cojines exactamente como en la foto de referencia. Ese es el estándar."),
         ("Lights: all off, unless there is a check-in the same day (then leave the purple light on).",
          "Luces: todas apagadas, salvo que haya una reservación que entra el mismo día (entonces deja la luz morada).")]),
 L.zone("casita", "home", "Casita (back house)", "Casita (casa de atrás)", "t3", ["30", "32"],
        [("At the back of floor 1: a small casita, like a mother-in-law suite.", "En la parte de atrás del piso 1: una casita, tipo mother-in-law suite."),
         ("Its own entry code, different from the main house. It is sent in your assignment email.",
          "Tiene su propia clave de entrada, diferente a la de la casa principal. Se envía en tu correo de asignación."),
         ("Queen bed with the towels on top. Sweep and mop.", "Cama queen con las toallas encima. Barre y trapea."),
         ("Clean bathroom with toilet paper and paper towel as usual.", "Baño limpio con papel higiénico y paper towel como siempre."),
         ("Check the fridge and the kitchen.", "Revisa la nevera y la cocina."),
         ("Leave the lamp plugged in on the kitchen counter.", "Deja la lámpara conectada en el mesón de la cocina."),
         ("Do NOT leave paper towels in this small kitchen.", "En esta cocinita NO se deja paper towel."),
         ("The mini split by the door stays OFF.", "El mini split de la puerta queda APAGADO.")]),
 L.zone("outdoor", "sun", "Outdoor BBQ", "Barbecue de afuera", "t1", [],
        [("Outside on floor 1: a BBQ. Check that it has no food inside and clean it.", "Afuera en el piso 1: un barbecue. Revisa que no tenga comida y límpialo."),
         ("The cleaning brush hangs outside the grill: brush it for 30 seconds and it is ready.",
          "El cepillo cuelga afuera del barbecue: pásale el cepillo 30 segundos y queda listo.")]),
]

# ---------- Floor 2 ----------
Z2 = [
 L.zone("stairs", "stairs", "Stairs", "Escaleras", "t2", [],
        [("Vacuum the stairs, including the runner down the middle.", "Aspira las escaleras, incluido el runner que va por la mitad.")]),
 L.zone("hallbath", "drop", "Hall bath", "Baño del pasillo", "t2", [],
        [("First bathroom on your left when you come up.", "Primer baño a mano izquierda al subir."),
         ("Toilet paper: 3 rolls (1 hung, 2 new).", "Papel higiénico: 3 rollos (1 colgado, 2 nuevos)."),
         ("Hand towel and makeup towel.", "Toalla de manos y toalla de make-up."),
         ("Glass with NO water marks. Sweep and mop.", "Vidrios SIN marcas de agua. Barre y trapea.")]),
 L.zone("room-a", "bed", "Room straight ahead · 2 queens", "Cuarto de frente · 2 queen", "t2", [],
        [("Directly in front when you come up the stairs.", "Directamente al frente al subir las escaleras."),
         ("Two queen beds, towels on top of each bed.", "Dos camas queen, toallas encima de cada cama."),
         ("Doors closed. Curtains closed and even.", "Puertas cerradas. Cortinas cerradas y parejas.")],
        notes=[("Careful with the curtain rod: the setup is odd (the curtain is tangled at the anchor) and the rod can come loose if you pull or force it. "
                "If it comes loose, one pole slides into the other and sits back on the anchor. Try not to need that.",
                "Cuidado con el palo de la cortina: el montaje es raro (la cortina queda enredada en el anchor) y el palo se puede desajustar si jalas o haces fuerza. "
                "Si se desajusta, un palo entra dentro del otro y se vuelve a poner sobre el anchor. Ojalá no haya que hacerlo.")]),
 L.zone("room-b", "tv", "Next room · king + queen + TV", "Siguiente cuarto · king + queen + TV", "t2", ["21"],
        [("Going clockwise: one king bed and one queen bed next to a TV with a game console.",
          "En sentido de reloj: una cama king y una queen junto a un televisor con consola de juegos."),
         ("Check that the console and everything with it is there.", "Asegura que la consola y todo lo que va con ella esté ahí."),
         ("The king is the main bed of floor 2. Its 2 green pillows must be CENTERED.",
          "La king es la cama principal del piso 2. Sus 2 cojines verdes deben quedar CENTRADOS.")],
        notes=[("Pillows on only one side look uneven and bad.", "Si se ponen solo de un lado se ve disparejo y feo.")]),
 L.zone("room-c", "bed", "Last room · king + queen + bath", "Último cuarto · king + queen + baño", "t2", [],
        [("Another king bed and another queen bed, with its own bathroom.", "Otra cama king y otra queen, con baño propio."),
         ("The shower has a plastic base and a glass panel: no water marks on the glass.",
          "La ducha tiene base plástica y un vidrio: sin marcas de agua en el vidrio."),
         ("Toilet paper, towels and finish as in every bathroom.", "Papel, toallas y acabado igual que en todos los baños.")]),
]

# ---------- Before you leave ----------
SEC = "Before you leave"
FINISH = L.card("finish", "video", "Before you leave", "Antes de irte",
                f'<p class="lead">{T("Check, in this order:", "Revisa, en este orden:")}</p>' +
                L.cklist(SEC, [
                    ("Thermostats at 77 and ALL mini splits OFF.", "Termostatos en 77 y TODOS los mini splits APAGADOS."),
                    ("All curtains closed and even.", "Todas las cortinas cerradas y parejas."),
                    ("All lights off (purple light only if there is a check-in today).", "Todas las luces apagadas (luz morada solo si hay reservación hoy)."),
                    ("All TVs work.", "Todos los televisores funcionan."),
                    ("Every outside door closed and locked, shown in the final video.", "Todas las puertas de afuera cerradas y aseguradas, mostrado en el video final."),
                ]) + L.gallery(["09"], SEC) +
                f'<h3 class="sub2">{ic("camera", "ic")}{T("Required photos and video", "Fotos y video obligatorios")}</h3>' +
                L.cklist("Required photos and video", [
                    ("When everything is clean and restocked, photograph the whole house.",
                     "Cuando todo esté limpio y restockeado, toma fotos de toda la casa."),
                    ("Video walkthrough of the entire property with the date and time on screen (timestamp camera app).",
                     "Graba un video recorriendo toda la propiedad con la fecha y la hora visibles en pantalla (app de cámara con timestamp)."),
                    ("Go floor by floor. Show every room and every bathroom.", "Ve piso por piso. Muestra cada cuarto y cada baño."),
                    ("The video MUST show you closing and locking the outside doors.", "El video DEBE mostrar cómo cierras y aseguras las puertas de afuera."),
                    ("Photos and video of the whole house are mandatory.", "Las fotos y el video de toda la casa son obligatorios."),
                    ("Send them to the property's WhatsApp group.", "Envíalos al grupo de WhatsApp de la propiedad."),
                ]), cls="card finish")

# ---------- At a glance ----------
GLANCE = L.glance(
    [("6", "Bedrooms", "Cuartos", False), ("4.5", "Baths", "Baños", False), ("18", "Sleeps up to", "Duermen hasta", False),
     ("77°F", "A/C, always", "Aire, siempre", True)],
    [("beds", "2", "Large towels", "Toallas grandes", L.two("on every bed", "en cada cama")),
     ("beds", "1", "Hand towel", "Toalla de manos", L.two("on every bed", "en cada cama")),
     ("beds", "2", "Washcloths", "Washcloths", L.two("on every bed", "en cada cama"))])

NAV = [("start", "Start", "Inicio"), ("musts", "Rules", "Reglas"), ("beds", "Beds", "Camas"), ("floor1", "Floor 1", "Piso 1"),
       ("floor2", "Floor 2", "Piso 2"), ("finish", "Final", "Final")]

body = (START + ALERTS + BEDS +
        L.floorhead("house", ic("home", "ic"), "Whole house", "Toda la casa", False) + "".join(Z0) +
        L.floorhead("floor1", "1", "Floor 1 · Main floor and casita", "Piso 1 · Planta baja y casita", False) + "".join(Z1) +
        L.floorhead("floor2", "2", "Floor 2 · Upstairs", "Piso 2 · Segundo piso", True) + "".join(Z2) +
        FINISH)

os.makedirs(os.path.join(OUT, "p"), exist_ok=True)
shutil.copy(os.path.join(S, "house", "post.jpg"), os.path.join(OUT, "p", "house.jpg"))

page = L.page_html("Post Avenue", "248 Post Avenue, San Antonio, TX", "This is the house", NAV, GLANCE, body, "2026-10-26",
                   note=("Door codes (including the casita) are sent with your assignment email. They are not on this page.",
                         "Los códigos de las puertas (incluida la casita) se envían en el correo de asignación. No están en esta página."))
L.finish(OUT, page, MEDIA)
n = L.write_sql(os.path.join(S, "post_items.sql"), PAGE_ID)
print("sop_items rows:", n, "->", os.path.join(S, "post_items.sql"))
