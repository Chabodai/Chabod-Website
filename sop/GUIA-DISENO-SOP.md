# Guia de diseno y contenido de las paginas SOP de Chabod

Para Claude (chat) y Claude Code. Lectura obligatoria antes de crear o cambiar cualquier pagina SOP. Referencia viva: la pagina de **Morsehead** (`tools/build_morse.py` + `tools/sop.css` + `tools/sop2.css`). Andres la aprobo como el estilo a seguir. Fecha: 2026-10-26.

## 1. Principios (lo que Andres pidio, en sus palabras)
1. **Visual, no interactivo.** Nada que el cleaner tenga que tocar, marcar o digitar: sin casillas, sin contadores que se tocan, sin barra de progreso, sin botones de reiniciar, sin localStorage de progreso. Las unicas interacciones permitidas: cambio EN/ES, chips de navegacion, abrir fotos en grande y deslizar tiras de fotos.
2. **Numeros grandes** para cantidades (toallas, washcloths, controles, termostato). El numero se ve de lejos; la etiqueta dice que es.
3. **Menos texto, mas visual.** Frases cortas e imperativas, una idea por linea. Si algo se explica con una foto o un icono, no se escribe un parrafo.
4. **Cada cuarto se distingue.** Cada cuarto o zona es su propia tarjeta con titulo grande, icono y barra de color. Nunca un bloque largo con varios cuartos mezclados.
5. **Las advertencias son pocas y claras.** Rojo/coral solo para reglas criticas de toda la casa (termostato, controles de ventiladores, pisos blancos, puertas). Una nota de un cuarto va como aviso suave dentro de la tarjeta de ese cuarto, nunca como un bloque rojo de pared a pared.
6. **Todo en dos idiomas** (EN/ES) con selector. Idioma por defecto segun el telefono. Ingles y espanol pre-renderizados en el HTML (`.t-en` / `.t-es`).
7. **Sin claves.** Ninguna clave de puerta, closet, lockbox o candado en la pagina ni en `sop_items`. Solo en `property_access` y en el correo de asignacion.
8. **No inventar.** Si falta un dato (almohadas, wifi, basura), no se rellena; se reporta en la lista de datos faltantes.

## 2. Estructura de la pagina (orden fijo)
1. Encabezado azul: "Chabod Cleaning Services - Standard operating procedure", nombre de la propiedad, direccion.
2. **Foto de la casa (hero)**, 16:9, con etiqueta "This is the house / Esta es la casa". Sirve para que el cleaner reconozca la casa. Origen: captura de Google Street View recortada (sin paneles de Google) o foto del anuncio. Archivo `house/<nombre>.jpg` (1400 px) en el paquete. Una foto lateral extra (cochera, botes de basura) va como foto normal en la zona correspondiente.
3. Barra pegajosa: selector EN/ES + chips (Start, Beds, Floor 1, Floor 2, Finish; adaptar a la propiedad).
4. **At a glance**: 4 fichas (cuartos, banos, cuantos duermen, dato clave como la temperatura final).
5. **Towel counts**: 3 fichas con numero grande (por bano / piscina) y debajo lo que acompana. Cada ficha enlaza a su zona.
6. **1 - Start here**: fotos antes de empezar (recorrer toda la casa, fotografiar danos, reportar a Andres, mandar al grupo de WhatsApp de la propiedad).
7. **Must-do rules**: tarjetas con icono y titulo corto (termostato, controles, pisos, mini splits, puertas, luces). Con foto de referencia cuando ayude.
8. **Bed guide**: una tarjeta por tipo de cama con etiquetas de capas (Fitted, Flat sheet, Duvet, Decor pillows; "No duvet" tachado en coral; "Duvet folded / rolled" en amarillo). Indicar en que cuartos aplica.
9. **Floor 1 / Floor 2** (o secciones propias): una tarjeta por zona en el orden en que se recorre la casa. Cada tarjeta: icono + titulo, tira de fotos, numeros grandes si hay (toallas), lista corta con puntos.
10. **Before you leave**: lista final + "Required photos and video" (fotos de cada cuarto, video de toda la casa con camara con sello de hora, enviar al grupo de WhatsApp, reportar lo roto o faltante) + 1-2 fotos de ejemplo con sello de hora.
11. Nota: "Door codes are sent with your assignment email. They are not on this page." y pie con fecha de actualizacion.

## 3. Componentes (clases en `tools/sop2.css`)
- `.glance .tile` ficha de dato; `.tile.hot` (coral) para el dato critico.
- `.towelrow .tw a` ficha de toallas con numero grande.
- `.card` tarjeta de seccion; `.ch` titulo con icono.
- `.zone` (+ `t1` petrol, `t2` azul, `t3` teal) tarjeta de zona/cuarto: `.zhead` (icono `.zic` + `h3`), `.zbody`, `.strip.gallery` (fotos deslizables), `.ctrs .ctr` (numero grande estatico: `<b>` numero, `.ctr-l` etiqueta), `.cks .li` lineas con punto `.dot`.
- `.acard` tarjeta de alerta con `.aic` (icono en circulo coral).
- `.bed` tarjeta de cama con `.layer` (`l-on`, `l-off`, `l-fold`).
- `.floorhead` encabezado de piso con numero.
- `.hero` foto de la casa.
- Iconos: SVG en linea estilo Feather (diccionario `IC` en `build_morse.py`). Sin emojis.
- Marca: azul #294b9b, teal #58bec2, petrol #008eb5, coral #eb5c3d, gris #ededed. Tipografia Baloo 2 (titulos) y Manrope (texto). Solo tema claro. Gutter de 16 px. Probar a 390 px de ancho.

## 4. Reglas de redaccion
- Titulos de zona = nombre real del cuarto o area, en el orden de recorrido. Nada de "Cuartos" como bloque generico.
- Cada linea: verbo + dato concreto. Ejemplo: "Leave 16 pool towels." No: "Please make sure that the pool towels are present."
- Cantidades siempre como numero grande en ficha, y repetidas en texto solo si hace falta.
- Una advertencia por idea. Texto de la advertencia: que, por que, como.
- Espanol natural de operaciones (washcloths, fitted, flat y duvet se quedan en ingles como los usa el equipo).
- Pies de foto cortos y neutrales; no afirmar nada que la foto no muestre.

## 5. Datos y Supabase
- `clients`, `properties`, `property_access` (claves, con `access_type`), `sop_pages` (`url_code` aleatorio de 16 hex, `status` draft/published), `sop_items` (`section`, `kind` text/photo/video, `position`, `label`, `body`, `lang` en/es, `photo_path`).
- El contenido de `sop_items` debe coincidir con lo publicado. Para Morsehead se genera con `tools/export_morse_sql.py` desde el HTML. Para propiedades nuevas, escribir primero el contenido (tupla por zona) y generar HTML y SQL de la misma fuente.
- Valores NULL explicitos en `clients` (las columnas tienen textos de ejemplo por defecto).

## 6. Proceso para una propiedad nueva
1. Andres dicta el recorrido y manda fotos. Verificar fotos con hojas de contacto numeradas antes de usarlas; descartar duplicadas.
2. Crear cliente, propiedad, `property_access` (claves) y `sop_pages` en borrador.
3. Escribir el contenido por zonas (EN/ES), foto de la casa, guia de camas, fichas de toallas, reglas criticas.
4. Construir con el script de la propiedad (modo borrador y modo produccion `worker/public/<url_code>/`), probar a 390 px: sin scroll horizontal, fotos cargan, visor abre, EN/ES cambia, sin errores de consola.
5. Buscar claves en `worker/public` (debe dar cero). `<title>SOP</title>`, `noindex, nofollow`.
6. Cargar `sop_items`, empaquetar el zip, Claude Code despliega y marca `published`.
7. Reportar a Andres los datos que faltan en una lista corta.

## 7. Que NO hacer (ya lo rechazo)
- Casillas, contadores tocables, progreso, boton de borrar.
- Bloques largos de texto con varios cuartos juntos.
- Advertencias rojas gigantes para algo que solo aplica a un cuarto.
- Zonas que se colapsan (el contenido debe estar siempre visible).

## 8. Como se genera una pagina nueva (agregado el 2026-10-26)
Viva la Fiesta y Post Avenue ya siguen esta guia. Su codigo es la plantilla para las proximas propiedades.
- `sop/tools/sop_lib.py`: componentes compartidos (zonas, alertas, guia de camas, fichas, galeria con fotos y videos, cabecera de la pagina) y exportador a SQL. El contenido se escribe UNA vez como tuplas EN/ES; el mismo codigo produce el HTML y las filas de `sop_items`, asi nunca se desfasan.
- `sop/tools/build_viva2.py` y `build_post2.py`: ejemplos completos. Para una propiedad nueva, copiar uno y cambiar `CODE`, `PAGE_ID`, `MEDIA` (fotos/videos), las zonas, las fichas y la direccion.
- `sop/tools/sop3.css`: tres reglas extra sobre sop.css + sop2.css: `.rnote` (nota suave amarilla dentro de un cuarto), parrafos separados dentro de una alerta y el icono dentro del numero de piso.
- Nota suave por cuarto = `notes=[...]` en `zone(...)`. Alerta roja = solo `L.alert(...)` y solo para reglas de toda la casa.
- Fichas "Towel counts" y contadores: numeros grandes, nunca tocables. Los contadores de una zona van en `counters=[(n, en, es, icono, tono)]`.
- Correr: `python -I sop/tools/build_viva2.py <carpeta del paquete>` (la carpeta tiene `house/` y `worker/public/<CODE>/p|v/`). Escribe `worker/public/<CODE>/index.html` y `viva_items.sql`; verifica que todos los archivos referenciados existan y que ninguna foto quede sin colocar.
- La cabecera de cada pagina DEBE empezar con `<meta charset="utf-8">` y llevar `<meta name="viewport" content="width=device-width, initial-scale=1">` (sin eso el celular dibuja a 980 px y los acentos salen rotos). `sop_lib.page_html` ya los incluye; `build_morse.py` tambien.
- Pruebas antes de desplegar (390 px): sin scroll horizontal, fotos cargan, visor abre y cierra, EN/ES cambia, videos reproducen sin boton de descarga, sin errores de consola, acentos bien con un servidor SIN cabecera charset, cero claves en `worker/public`.
- Despliegue: `npx wrangler deploy` dentro de la carpeta `worker` (con `workers_dev: false` y `preview_urls: false`). No tocar el dominio ni Access.
- Fotos de la casa: `house/<nombre>.jpg` 16:9 (1400 px) para el hero. Una foto lateral (cochera, botes) va como foto normal en la zona del garaje con un pie neutral.
- Pendiente en cada propiedad nueva: 1-2 fotos de ejemplo con sello de hora (en Viva y Post todavia faltan).
