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
