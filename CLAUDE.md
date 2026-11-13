# nahuel-tiktok-legal

Sitio estático mínimo con los documentos legales (términos y política de privacidad) que exige TikTok para registrar la app de desarrollador de Nahuel Barrera. El usuario habla en español rioplatense.

## Publicación

- Publicado con **GitHub Pages**: https://nahubarreraa.github.io/nahuel-tiktok-legal/
- Repo público: `Nahubarreraa/nahuel-tiktok-legal`, rama `main`. Un push a `main` actualiza el sitio (puede tardar un minuto). No hay build ni dependencias.
- Proyecto local: `D:\proyectos\nahuel-tiktok-legal`.

## Archivos

- `index.html` — portada con links a los dos documentos.
- `terminos.html` — términos de servicio.
- `privacidad.html` — política de privacidad (lista los permisos de TikTok solicitados: info básica, perfil, usuario, lista de videos, subir video; tokens gestionados por Composio). Tiene fecha de "última actualización"; actualizarla si se cambia el contenido.
- `tiktok*.txt` — archivos de verificación de dominio de TikTok Developers (`tiktok-developers-site-verification=...`). **No borrar ni renombrar**: TikTok los usa para verificar que el sitio es del titular, y deben quedar en la raíz con su nombre exacto.

## Convenciones

- HTML plano con CSS inline en cada página, mismo estilo (fondo `#f7f5f0`, texto `#22201b`, enlaces `#7a5c2e`, ancho máx. 680px). Mantener ese estilo en páginas nuevas.
- Contacto publicado: barreranahuel269@gmail.com.
- Si cambian los permisos de la app de TikTok o se agrega un servicio intermediario, actualizar la sección "Datos a los que accede" / "Dónde se almacenan" de `privacidad.html`.

## Agentes (flujo de carrusel de TikTok)

- Subagentes en `.claude/agents/`: `investigador-temas` → `generador-tarjetas` → `publicador-tiktok` (todos Sonnet). Los coordina el agente global `orquestador` (`~/.claude/agents/orquestador.md`), que también puede crear subagentes nuevos.
- `tools/tarjetas/` tiene la plantilla y el script de render de tarjetas (`render.ps1`); los fondos (`tools/tarjetas/fondos/`) no se versionan.
- Reglas de contenido: frases motivadoras contemporáneas, cohesión total con un tema de actualidad, citas verificadas, sin autores antiguos de relleno.

## App del celular (PWA) — `app/`

- PWA en https://nahubarreraa.github.io/nahuel-tiktok-legal/app/ (pestañas Subir / Biblioteca / Pedir / Ajustes). Lee `app/data/posts.json`, que se **regenera con `node tools/build-library.js`** a partir de `posts/cola/COLA.md` (correrlo después de cambiar COLA.md y commitear el JSON).
- El botón "Subir a borradores" dispara `.github/workflows/subir.yml` → `scripts/subir.js` → servidor MCP de Composio (`https://connect.composio.dev/mcp`, header `x-consumer-api-key`; la API REST no acepta la clave de cuenta `ck_...`). Requiere el secreto `COMPOSIO_API_KEY` del repo (probado OK desde Actions el 2026-11-12). Sin PC prendida. El token de GitHub de la app (fine-grained, Actions + Issues, vence 2027-02-10) vive solo en el teléfono.
- La conexión TikTok de Composio usa la app de TikTok Developers en modo **Sandbox** ("pruebas"; la de Producción está rechazada desde 2026-09-14). Usuario objetivo: `mentalidaddeacero.arg` (solo admite uno). Conexión `sandbox`, id `tiktok_awn-callus`.
- TikTok no permite elegir sonido por API: el video queda en borradores y el usuario pone el sonido en TikTok.
- "Pedir" crea issues con la etiqueta `pedido` en el repo; todavía no hay quien los procese automáticamente.

## Cola de posts listos (`posts/cola/`)

- `posts/cola/COLA.md` lista los posts ya generados (tarjetas JPG + título + descripción con hashtags) y su estado (`PENDIENTE` / `SUBIDO fecha`). Cuando el usuario dice "subí": tomar el primer `PENDIENTE`, publicarlo con `publicador-tiktok` (sonido Magnolia / Claudio Constantini), marcarlo `SUBIDO AAAA-MM-DD` en COLA.md y commitear. No investigar ni regenerar tarjetas. Si la cola se vacía o quedan <3, avisar al usuario para reponer.
