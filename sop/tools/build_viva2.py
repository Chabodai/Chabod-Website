#!/usr/bin/env python3
"""Visual SOP page for Viva la Fiesta (design guide: GUIA-DISENO-SOP.md; reference: build_morse.py).
Content comes from build_sop.py (same facts, same EN/ES wording, split into short lines per room).
Photos and videos already live in worker/public/<CODE>/p and /v. NO door / closet codes on this page.
Run: python -I build_viva2.py <package dir>      -> worker/public/<CODE>/index.html + viva_items.sql"""
import os, shutil, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import sop_lib as L
from sop_lib import T, ic, PH, VD

S = sys.argv[1]
CODE = "53648a2393b740ce"
PAGE_ID = "64c992ef-c866-4fff-8840-4b4ea3266421"
OUT = os.path.join(S, "worker", "public", CODE)

MEDIA = {
 "01": PH("01", "Living room", "Sala"),
 "02": PH("02", "Kitchen island and stove (the dining table shown is the previous one)",
          "Isla de la cocina y estufa (el comedor de la foto es el anterior)"),
 "03": PH("03", "Coffee station", "Estación de café"),
 "04": PH("04", "Floor 1 queen bed", "Cama queen del piso 1"),
 "05": PH("05", "Master king bed", "Cama king del máster"),
 "06": PH("06", "Bedroom 2 king bed", "Cama king del cuarto 2"),
 "07": PH("07", "Master bath: vanity and towel rings", "Baño del máster: tocador y argollas de toallas"),
 "08": PH("08", "Master bath: towels on the bar and walk-in closet", "Baño del máster: toallas en la barra y closet"),
 "09": PH("09", "Bedroom 2 bath (tub)", "Baño del cuarto 2 (tina)"),
 "10": PH("10", "Master bedroom desk", "Escritorio del cuarto máster"),
 "12": PH("12", "Terrace furniture, covered", "Muebles de la terraza, tapados"),
 "13": PH("13", "Stainless steel counter and BBQ with its cover", "Mesón de acero inoxidable y barbecue con cobertor"),
 "n01": PH("n01", 'Garage: gray and black supply closets', 'Garaje: closets de suministros gris y negro'),
 "n02": PH("n02", 'Lockbox on the wall between the closets', 'Lockbox en la pared entre los closets'),
 "n03": PH("n03", 'Stairs from floor 2 down to floor 1', 'Escaleras del piso 2 al piso 1'),
 "n04": PH("n04", 'Floor 2 thermostat', 'Termostato del piso 2'),
 "n06": PH("n06", 'Half bath', 'Medio baño'),
 "n07": PH("n07", 'Half bath: sink and hand towel', 'Medio baño: lavabo y toalla de mano'),
 "n08": PH("n08", 'Upper cabinets: glasses and mugs', 'Gabinetes de arriba: vasos y tazas'),
 "n09": PH("n09", 'Coffee drawer, organized', 'Cajón del café, organizado'),
 "n10": PH("n10", 'Coffee station', 'Estación de café'),
 "n11": PH("n11", 'Island cabinet: plates and bowls, microwave drawer', 'Gabinete de la isla: platos y bowls, microondas'),
 "n12": PH("n12", 'Drawers: utensils and silverware', 'Cajones: utensilios y cubiertos'),
 "n13": PH("n13", 'Kitchen counter, knife block and window', 'Mesón de la cocina, cuchillos y ventana'),
 "n14": PH("n14", 'Stove and towels on the oven door', 'Estufa y toallas en la puerta del horno'),
 "n15": PH("n15", 'Balcony door: handle and latch', 'Puerta del balcón: manija y seguro'),
 "n16": PH("n16", 'Sofa bed, closed: throw on the left arm, two pillows on the right', 'Sofá cama cerrado: manta en el brazo izquierdo, dos almohadas a la derecha'),
 "n17": PH("n17", 'TV console with the Wi-Fi frame and remote', 'Mueble del TV con el cuadro del Wi-Fi y el control'),
 "n18": PH("n18", 'Dining table (glass)', 'Mesa del comedor (vidrio)'),
 "n19": PH("n19", 'Stairs from floor 3 down to floor 2', 'Escaleras del piso 3 al piso 2'),
 "n20": PH("n20", 'Floor 3: TV, fan remote and light switches', 'Piso 3: TV, control del ventilador e interruptores'),
 "n21": PH("n21", 'Bedroom 2 king bed', 'Cama king del cuarto 2'),
 "n22": PH("n22", 'Spiral stairs between floor 3 and the terrace', 'Escalera de caracol entre el piso 3 y la terraza'),
 "n23": PH("n23", 'Floor 3 thermostat, in the hallway', 'Termostato del piso 3, en el pasillo'),
 "n24": PH("n24", 'Laundry closet: stacked washer and dryer', 'Closet de lavandería: lavadora y secadora'),
 "side": PH("house-side", "Side of the building: garage doors and trash bins", "Costado del edificio: puertas de garaje y botes de basura"),
 "v01": VD("v01", "Master king bed (video)", "Cama king del máster (video)"),
 "v02": VD("v02", "Bedroom 2 king bed (video)", "Cama king del cuarto 2 (video)"),
 "v03": VD("v03", "Terrace entry: bar sink, green wall and decorative chair", "Entrada de la terraza: sink del bar, tapete verde y silla decorativa"),
 "v04": VD("v04", "Entry nook: wallpaper wall, oval mirror and bench", "Entrada del piso 1: pared de papel tapiz, espejo ovalado y banca"),
 "v05": VD("v05", "Floor 1 queen bed (video)", "Cama queen del piso 1 (video)"),
 "v06": VD("v06", "Floor 1 bathroom: black basket with rolled washcloths and shower curtain", "Baño del piso 1: canasta negra con washcloths enrollados y cortina de ducha"),
 "v07": VD("v07", "Kitchen cabinet: plates and bowls (1)", "Gabinete de la cocina: platos y bowls (1)"),
 "v08": VD("v08", "Kitchen cabinet: plates and bowls (2)", "Gabinete de la cocina: platos y bowls (2)"),
 "v09": VD("v09", "Coffee drawer: K-Cups and Nespresso pods", "Cajón del café: K-Cups y cápsulas Nespresso"),
 "v10": VD("v10", "Gray closet: linens and towels", "Closet gris: sábanas y toallas"),
 "v11": VD("v11", "Black closet: refill supplies", "Closet negro: suministros de reposición"),
}
L.init(CODE, MEDIA)

# ---------- 1 · Start here ----------
SEC = "Start here"
START = L.card("start", "camera", "1 · Start here", "1 · Empieza aquí",
               f'<p class="lead">{T("Before you clean anything:", "Antes de limpiar nada:")}</p>' +
               L.cklist(SEC, [
                   ("Walk the whole house. Photograph every floor, room, bathroom, the kitchen, the terrace and the garage, as you found them.",
                    "Recorre toda la casa. Toma fotos de cada piso, cuarto, baño, la cocina, la terraza y el garaje, tal como los encontraste."),
                   ("Damage (broken, stained, missing, out of place): take clear photos and tell Andrés right away.",
                    "Daños (algo roto, manchado, faltante o fuera de lugar): toma fotos claras y avísale a Andrés de inmediato."),
                   ("Send all photos to this property's WhatsApp group.",
                    "Envía todas las fotos al grupo de WhatsApp de esta propiedad."),
               ]), cls="card start")

# ---------- Must-do rules (house-wide only) ----------
SEC = "Must-do rules"
ALERTS = L.card("musts", "alert", "Must-do rules", "Reglas obligatorias",
                L.alert(SEC, "stairs", "Clean from the top down", "Limpia de arriba hacia abajo",
                        [("Start on the terrace and work down. Dirt falls to the floor below.",
                          "Empieza en la terraza y baja. La mugre cae al piso de abajo.")]) +
                L.alert(SEC, "layers", "Stairs first", "Escaleras primero",
                        [("The stairs are open underneath. Sweep and mop the stairs FIRST.",
                          "Las escaleras son huecas. Barre y trapea las escaleras PRIMERO."),
                         ("Do not clean anything on the lower floor until the stairs that lead to it are swept.",
                          "No limpies nada del piso de abajo hasta haber barrido las escaleras que llegan a ese piso.")]),
                cls="card alerts")

# ---------- Bed guide ----------
SEC = "Bed guide"
BEDS = L.card("beds", "bed", "Bed guide", "Guía de camas",
              f'<p class="lead">{T("Make every bed to match the photos.", "Tiende cada cama igual que las fotos.")}</p>' +
              L.bedcard(SEC, "bed", "b1", "King beds", "Camas king",
                        "Floor 3 · master bedroom and bedroom 2", "Piso 3 · cuarto máster y cuarto 2",
                        [L.L_FIT, L.L_FLAT, ("Duvet folded in half at the foot", "Duvet doblado por la mitad a los pies", "l-fold"),
                         ("4 white pillows", "4 almohadas blancas", "l-on"), ("Square decor pillows", "Almohadas decorativas cuadradas", "l-on")],
                        ("Fold the duvet like a runner.", "El duvet va como un runner.")) +
              L.bedcard(SEC, "bed", "b2", "Queen bed", "Cama queen",
                        "Floor 1 · bedroom", "Piso 1 · cuarto",
                        [("Fitted, pulled tight", "Fitted estirada", "l-on"), ("Flat sheet, pulled tight to the top", "Flat estirada hasta arriba", "l-on"),
                         ("Duvet like a runner, new clean cover", "Duvet como runner, forro nuevo y limpio", "l-fold"),
                         ("4 standard pillows", "4 almohadas estándar", "l-on"), ("Matching decor pillow", "Almohada decorativa correspondiente", "l-on")]) +
              L.bedcard(SEC, "layers", "b3", "Sofa bed", "Sofá cama",
                        "Floor 2 · living room · queen size. The extra queen set is in the floor 1 bedroom closet.",
                        "Piso 2 · sala · medida queen. El set queen extra está en el closet del cuarto del piso 1.",
                        [("Open it", "Ábrelo", "l-fold"), ("Check: no sheets, no food", "Revisa: sin sábanas ni comida", "l-fold"),
                         ("Shake it out", "Sacúdelo", "l-fold"), ("Close it", "Ciérralo", "l-fold")]))

# ---------- House-wide zones ----------
Z0 = [
 L.zone("stairs", "stairs", "Stairs and landings", "Escaleras y descansos", "t3", ["n22", "n19", "n03"],
        [("Check for trash bags.", "Revisa las bolsas de basura."),
         ("Sweep and mop every flight.", "Barre y trapea las escaleras en cada tramo."),
         ("Decorative chairs and a green panel on the wall. The green panel always stays on the wall.",
          "Hay sillas decorativas y un tapete verde en la pared. El tapete verde siempre va en la pared."),
         ("Arrange the decorative pillows neatly.", "Acomoda muy bien las almohadas decorativas.")]),
 L.zone("bathrooms", "drop", "All bathrooms", "Todos los baños", "t3", [],
        [("Hand towel on the ring, with a makeup towel hung over it. The word “makeup” must read clearly (white on black).",
          "Toalla de mano en el hanger y encima una toalla de makeup, colgada para que se lea “makeup” (blanco sobre negro)."),
         ("Black basket: 2 toilet paper rolls inside, the 2 rolled white washcloths on top.",
          "Canasta negra: 2 papeles higiénicos adentro y encima los 2 rollitos de washcloth blanco."),
         ("No black basket: rolled washcloths on the sink counter, 2 toilet paper rolls under the sink.",
          "Sin canasta negra: washcloth en rollito sobre el countertop del sink y 2 papeles higiénicos debajo del sink."),
         ("Always a new roll on the holder.", "Siempre un papel nuevo puesto."),
         ("Fill the soap dispensers, each with its own soap.", "Llena los jabones, cada uno con su jabón."),
         ("Check the drawers and everywhere else for hair.", "Revisa que no haya pelos en los cajones ni en ningún lado."),
         ("Always a hair dryer in every bathroom.", "Siempre un hair dryer en cada baño."),
         ("New trash bag in every bathroom.", "Bolsa de basura nueva en todos los baños."),
         ("Clean glass, counters and sink. Sweep and mop.", "Limpia vidrio, mesones y sink. Barre y trapea.")],
        [(2, "Large towels hanging", "Toallas grandes colgadas", "towel", ""),
         (2, "Extra towels under the sink", "Toallas extras debajo del sink", "towel", ""),
         (2, "Washcloths, rolled", "Washcloths en rollito", "towel", "")]),
]

# ---------- Floor 4 ----------
Z4 = [
 L.zone("terrace", "sun", "Terrace", "Terraza", "t1", ["12", "13", "v03"],
        [("Leave the furniture always covered with the all-weather cover.",
          "Los muebles siempre se dejan tapados con el cobertor para todo tipo de clima."),
         ("BBQ: no food inside. Clean the outside with Windex so no dirt or dust shows.",
          "Barbecue: sin comida adentro. Limpia el exterior con Windex para que no se vea mugre ni polvo."),
         ("BBQ: put the cover back on when done.", "Barbecue: al terminar, ponle el cobertor."),
         ("Bar kitchenette at the entrance: clean the counters and the stainless steel.",
          "Cocinita tipo bar a la entrada: limpia los mesones y el acero inoxidable."),
         ("Bar: no trash and no opened bottles.", "Bar: sin basura ni botellas ya iniciadas.")]),
]

# ---------- Floor 3 ----------
Z3 = [
 L.zone("master", "bed", "Master bedroom", "Cuarto máster", "t2", ["05", "10", "v01"],
        [("King bed: fitted, flat and duvet. Fold the duvet in half at the foot, like a runner.",
          "Cama king: fitted, flat y duvet. El duvet va doblado por la mitad a los pies, como un runner."),
         ("4 white pillows plus the square decorative pillows.", "4 almohadas blancas más las almohadas decorativas cuadradas."),
         ("Vacuum the carpet.", "Aspira la alfombra."),
         ("Closet inside the master.", "Closet dentro del máster."),
         ("Back wall: dark gray with a square-panel trim.", "Pared de fondo: gris oscuro con molduras de cuadrados.")]),
 L.zone("master-bath", "drop", "Master bath", "Baño del máster", "t2", ["07", "08"],
        [("Inside the master bedroom.", "Dentro del cuarto máster."),
         ("Shower, no tub.", "Ducha, sin tina."),
         ("Towels, washcloths and supplies: see All bathrooms.", "Toallas, washcloths y suministros: ver Todos los baños.")]),
 L.zone("bedroom2", "bed", "Bedroom 2", "Cuarto 2", "t2", ["06", "n21", "v02"],
        [("King bed, made like the master: fitted, flat, duvet folded at the foot.",
          "Cama king, igual que el máster: fitted, flat y duvet doblado a los pies."),
         ("4 white pillows plus the square decorative pillows.", "4 almohadas blancas más las almohadas decorativas cuadradas."),
         ("Vacuum the carpet.", "Aspira la alfombra."),
         ("Auxiliary king room: white wallpaper on the back wall.", "Cuarto king auxiliar: papel tapiz blanco de fondo.")]),
 L.zone("bedroom2-bath", "drop", "Bedroom 2 bath", "Baño del cuarto 2", "t2", ["09"],
        [("Inside bedroom 2.", "Dentro del cuarto 2."),
         ("Bathroom with a tub.", "Baño con tina."),
         ("Towels, washcloths and supplies: see All bathrooms.", "Toallas, washcloths y suministros: ver Todos los baños.")]),
 L.zone("laundry", "wash", "Laundry", "Lavandería", "t2", ["n24", "n23", "n20"],
        [("Washer and dryer are on floor 3.", "Lavadora y secadora en el piso 3."),
         ("Leave enough washer pods and dryer sheets.", "Deja suficientes pods de lavadora y hojas de secadora."),
         ("Laundry is done on site: wash what is dirty, dry it, fold it.",
          "La lavandería se hace ahí mismo, en la casa: lava lo sucio, sécalo y dóblalo."),
         ("Leave the made-up sets folded in the closet.", "Deja los sets armados doblados en el closet."),
         ("Sweep and mop floor 3.", "Barre y trapea el piso 3.")]),
]

# ---------- Floor 2 ----------
Z2 = [
 L.zone("living", "tv", "Living room", "Sala", "t1", ["01", "n16", "n17", "n04", "n15"],
        [("The sofa is also a bed (queen). Always check it: open it and extend it for a moment.",
          "El sofá también es cama (queen). Revísalo siempre: ábrelo y extiéndelo un momento."),
         ("Check nobody used sheets or left food. Shake it out and close it again.",
          "Revisa que no hayan usado sábanas ni dejado comida. Sacúdelo y ciérralo otra vez."),
         ("The extra queen set from the floor 1 closet is for this sofa.",
          "El set queen extra del closet del piso 1 es para este sofá."),
         ("TV remote stays on the coffee table. Test that the TV works and the remote has batteries.",
          "El control del televisor queda en la mesita. Prueba que el televisor funcione y que el control tenga pilas."),
         ("Small Wi-Fi frame on the counter. It must always be there.",
          "El cuadrito con el nombre y la clave del Wi-Fi está en el mesón. Debe estar siempre ahí."),
         ("Vacuum the rug.", "Aspira la alfombra.")]),
 L.zone("dining", "pot", "Dining", "Comedor", "t1", ["n18"],
        [("The dining table is glass. It must look very clean.", "El comedor es de vidrio. Debe verse muy limpio.")],
        notes=[("The kitchen reference photo shows the previous dining table.",
                "La foto de referencia de la cocina muestra el comedor anterior.")]),
 L.zone("kitchen", "pot", "Kitchen", "Cocina", "t1", ["02", "n13", "n14", "n11", "n12", "n08", "v07", "v08"],
        [("Clean all counters and the stove.", "Limpia todos los mesones y la estufa."),
         ("Nothing left in the oven. No food in the pantry or the fridge.",
          "Nada en el horno. Sin comida en el pantry ni en la nevera."),
         ("Pots with pots, pans with pans, plates with plates.", "Ollas con ollas, sartenes con sartenes, platos con platos."),
         ("Glasses and cups on the upper shelves.", "Vasos y pocillos arriba."),
         ("Silverware, knives and utensils, each together.", "Cubiertos con cubiertos, cuchillos con cuchillos, utensilios con utensilios."),
         ("Open the drawers: everything in order.", "Abre los cajones: todo ordenado."),
         ("Window (faces the back) and window sill: check them. Mosquitoes and splashes.",
          "Revisa la ventana (da hacia atrás) y el window sill: a veces hay mosquitos y salpica."),
         ("Under the sink: new paper towels, new sponge, dishwasher pods.",
          "Debajo del sink: papel nuevo, esponja nueva, pods de dishwasher."),
         ("On top: new paper towels, new sponge, dry counter.", "Arriba: papel nuevo, esponja nueva, mesón seco."),
         ("Soap dispensers are black: dripped soap shows. Check them.",
          "Los dispensadores de jabón son negros y se nota el jabón escurrido. Revísalos.")]),
 L.zone("coffee", "coffee", "Coffee station", "Estación de café", "t1", ["03", "n10", "n09", "v09"],
        [("Everything is white: coffee makers with no used pods and no coffee splashes.",
          "Todo es blanco: cafeteras sin pods usados y sin splashes de café."),
         ("Coffee maker walls clean.", "Paredes de la cafetera limpias."),
         ("On the counter: creamers, powdered coffee, sugar and syrup.", "Afuera: creamers, café en polvo, azúcar y syrup."),
         ("In the drawer under the coffee maker: coffee pods, Nespresso and tea.",
          "En el cajón debajo de la cafetera: coffee pods, Nespresso y té."),
         ("Leave everything restocked.", "Deja todo restockeado.")]),
 L.zone("halfbath", "drop", "Half bath", "Medio baño", "t1", ["n06", "n07"],
        [("Counters and hand towel with the makeup towel hung over it, same as the other bathrooms.",
          "Mesones y toalla de mano con toalla de makeup colgada encima, igual que en los otros baños."),
         ("No washcloths here.", "No lleva washcloth."),
         ("Toilet paper: 1 new roll on the holder and 2 below.", "Papel higiénico: 1 nuevo puesto y 2 abajo."),
         ("New trash bag. Sweep and mop.", "Bolsa nueva. Barre y trapea.")]),
 L.zone("floor2-end", "check", "Before you leave this floor", "Antes de salir del piso", "t1", [],
        [("Sweep and mop all of floor 2 and the stairs down to floor 1.",
          "Barre y trapea todo el piso 2 y las escaleras al piso 1.")]),
]

# ---------- Floor 1 ----------
Z1 = [
 L.zone("entry", "home", "Entry nook", "Entrada", "t2", ["v04"],
        [("Small glass panel next to a wallpapered wall. Clean the glass.",
          "Hay un vidrio pequeño junto a una pared de papel tapiz. Limpia el vidrio.")]),
 L.zone("bedroom1", "bed", "Bedroom", "Cuarto", "t2", ["04", "v05"],
        [("Queen bed: fitted and flat sheets pulled tight to the top.", "Cama queen: fitted y flat estiradas hasta arriba."),
         ("Duvet with a new, clean cover, laid like a runner.", "Duvet con forro nuevo y limpio, puesto como runner."),
         ("4 standard pillows plus the matching decorative pillow.", "4 almohadas estándar más la almohada decorativa correspondiente."),
         ("Back wall: dark gray with a vertical-line trim.", "Pared de fondo: gris oscuro con molduras de líneas verticales."),
         ("Leave an extra queen set in this room's closet. It is the set for the floor 2 sofa bed.",
          "Deja un set queen extra en el closet de este cuarto: es el set para el sofá cama del piso 2.")]),
 L.zone("bath1", "drop", "Bathroom", "Baño", "t2", ["v06"],
        [("Shower with a curtain (no glass door).", "Ducha con cortina (sin puerta de vidrio)."),
         ("Black basket: 2 toilet paper rolls and the 2 rolled washcloths on top.",
          "Canasta negra: 2 papeles higiénicos y encima 2 rollitos de washcloth."),
         ("New roll hung on the holder. New trash bag.", "Papel nuevo colgado. Bolsa nueva."),
         ("Clean glass, counter and sink.", "Limpia vidrio, mesón y sink."),
         ("Hand towel with the makeup towel hung over it.", "Toalla de mano con toalla de makeup colgada encima.")],
        [(1, "Towel hanging on the bar", "Toalla colgada en la barra", "towel", ""),
         (3, "Towels under the sink", "Toallas debajo del sink", "towel", "")],
        notes=[("Only one towel fits on the bar: the other 3 go under the sink.",
                "Solo cabe una toalla colgada: las otras 3 van debajo del sink.")]),
 L.zone("garage", "car", "Garage", "Garaje", "t2", ["side", "n01"],
        [("The floor is concrete: sweep and mop.", "El piso es de cemento: barre y trapea."),
         ("Check that no trash or trash bags were left in the garage.", "Revisa que no hayan dejado basura ni bolsas de basura en el garaje.")]),
 L.zone("closets", "key", "Supply closets", "Closets de suministros", "t2", ["n02", "v10", "v11"],
        [("Two metal closets in the garage.", "Dos closets metálicos en el garaje."),
         ("Black closet: refill items (soaps, coffees) and some laundry.", "Closet negro: cosas de rellenar (jabones, cafés) y un poco de laundry."),
         ("Gray closet: all the laundry.", "Closet gris: todo el laundry."),
         ("Keep it in order: Chabod management checks and tracks who last left it this way.",
          "Mantén el orden: el management de Chabod revisa y rastrea quién fue la última persona en dejarlo así."),
         ("Lockbox with the keys on the wall between the two closets. Take out the key and open the closets.",
          "En la pared entre los dos closets hay un lockbox con las llaves. Saca la llave y abre los closets."),
         ("When you finish, put the key back in the lockbox and take a photo showing it is there.",
          "Al terminar, vuelve a dejar la llave en el lockbox y toma foto de que quedó ahí.")]),
]

# ---------- Before you leave ----------
SEC = "Before you leave"
FINISH = L.card("finish", "video", "Before you leave", "Antes de irte",
                L.cklist(SEC, [
                    ("Take the trash out through the garage door. The bins are at the garage exit.",
                     "Saca la basura por la puerta del garaje. Los contenedores están a la salida del garaje."),
                    ("Valet trash picks up from the bins at the garage exit. You do not need to know the pickup day.",
                     "La casa tiene servicio de valet trash: recogen de los botes a la salida del garaje. No hace falta saber el día de recogida."),
                    ("Both doors closed: the walk-in door and the garage door.",
                     "Las dos puertas cerradas: la puerta peatonal y la puerta del garaje."),
                    ("Photo of the key back in the lockbox.", "Foto de la llave de vuelta en el lockbox."),
                ]) +
                L.final_video([("Send the video to the property's WhatsApp group.", 'Envía el video al grupo de WhatsApp de la propiedad.')]), cls="card finish")

# ---------- At a glance ----------
GLANCE = L.glance(
    [("4", "Floors", "Pisos", False), ("3", "Bedrooms", "Cuartos", False), ("3.5", "Baths", "Baños", False),
     ("4→1", "Clean top down", "De arriba abajo", True)],
    [("bathrooms", "2", "Hanging", "Colgadas", L.two("large towels", "toallas grandes", "every bathroom", "cada baño")),
     ("bathrooms", "2", "Under the sink", "Debajo del sink", L.two("extra towels", "toallas extras")),
     ("bathrooms", "2", "Washcloths", "Washcloths", L.two("rolled", "en rollito", "none in half bath", "no en el medio baño"))])

NAV = [("start", "Start", "Inicio"), ("beds", "Beds", "Camas"), ("house", "House", "Casa"), ("floor4", "Floor 4", "Piso 4"),
       ("floor3", "Floor 3", "Piso 3"), ("floor2", "Floor 2", "Piso 2"), ("floor1", "Floor 1", "Piso 1"), ("finish", "Final", "Final")]

body = (START + ALERTS + BEDS +
        L.floorhead("house", ic("home", "ic"), "Whole house", "Toda la casa", False) + "".join(Z0) +
        L.floorhead("floor4", "4", "Floor 4 · Terrace", "Piso 4 · Terraza", False) + "".join(Z4) +
        L.floorhead("floor3", "3", "Floor 3 · Bedrooms and laundry", "Piso 3 · Cuartos y lavandería", True) + "".join(Z3) +
        L.floorhead("floor2", "2", "Floor 2 · Living area and kitchen", "Piso 2 · Sala y cocina", False) + "".join(Z2) +
        L.floorhead("floor1", "1", "Floor 1 · Bedroom and garage", "Piso 1 · Cuarto y garaje", True) + "".join(Z1) +
        FINISH)

# hero + the extra side photo come from the package's house/ folder
os.makedirs(os.path.join(OUT, "p"), exist_ok=True)
shutil.copy(os.path.join(S, "house", "viva-front.jpg"), os.path.join(OUT, "p", "house.jpg"))
shutil.copy(os.path.join(S, "house", "viva-side.jpg"), os.path.join(OUT, "p", "house-side.jpg"))
shutil.copy(os.path.join(S, "house", "viva-side-t.jpg"), os.path.join(OUT, "p", "house-side-t.jpg"))

page = L.page_html("Viva la Fiesta", "203 Paschal St #101, San Antonio, TX 78212", "This is the house", NAV, GLANCE, body, "2026-10-26",
                   note=("Door and supply closet codes are sent with your assignment email. They are not on this page.",
                         "Los códigos de las puertas y del closet de suministros se envían en el correo de asignación. No están en esta página."))
L.finish(OUT, page, MEDIA)
n = L.write_sql(os.path.join(S, "viva_items.sql"), PAGE_ID)
print("sop_items rows:", n, "->", os.path.join(S, "viva_items.sql"))
