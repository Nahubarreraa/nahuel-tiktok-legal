// Sube un post de la biblioteca a los BORRADORES de TikTok usando la API REST de Composio.
// Lo corre .github/workflows/subir.yml. Variables: COMPOSIO_API_KEY, POST_ID, SITE
// (opcional: COMPOSIO_CONNECTED_ACCOUNT_ID, COMPOSIO_USER_ID).
// Node 22: usa fetch y crypto nativos. Sin dependencias.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE = 'https://backend.composio.dev/api/v3.1';
const KEY = process.env.COMPOSIO_API_KEY;
const SITE = (process.env.SITE || '').replace(/\/$/, '');
const ACCOUNT = process.env.COMPOSIO_CONNECTED_ACCOUNT_ID || 'tiktok_awn-callus'; // conexión "sandbox"
const USER = process.env.COMPOSIO_USER_ID || undefined;

const fail = (m) => { console.error('ERROR: ' + m); process.exit(1); };
if (!KEY) fail('Falta el secreto COMPOSIO_API_KEY en el repositorio (Settings > Secrets and variables > Actions).');

const encPath = (carpeta, f) => carpeta.split('/').map(encodeURIComponent).join('/') + '/' + encodeURIComponent(f);

async function composio(pathname, body) {
  const r = await fetch(BASE + pathname, {
    method: 'POST',
    headers: { 'x-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const txt = await r.text();
  let j; try { j = JSON.parse(txt); } catch { j = { raw: txt }; }
  if (!r.ok) fail(`${pathname} -> HTTP ${r.status}: ${txt.slice(0, 600)}`);
  return j;
}

async function ejecutar(tool, args) {
  const body = { connected_account_id: ACCOUNT, arguments: args };
  if (USER) body.user_id = USER;
  const j = await composio('/tools/execute/' + tool, body);
  console.log(tool, JSON.stringify(j).slice(0, 800));
  if (j.successful === false || j.error) fail(`${tool} devolvió error: ${JSON.stringify(j.error || j).slice(0, 600)}`);
  const inner = j.data && (j.data.data || j.data);
  if (inner && inner.error && inner.error.code && inner.error.code !== 'ok') fail(`TikTok respondió: ${JSON.stringify(inner.error)}`);
  return inner;
}

(async () => {
  const lib = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'app/data/posts.json'), 'utf8')).posts;
  const post = lib.find((p) => String(p.id) === String(process.env.POST_ID));
  if (!post) fail('No existe el post ' + process.env.POST_ID);
  console.log(`Post #${post.id}: ${post.titulo} (${post.tipo})`);

  const descripcion = `${post.caption} ${post.hashtags.join(' ')}`.trim();

  if (post.tipo === 'video') {
    const archivo = post.archivos.find((f) => f.endsWith('.mp4'));
    if (!archivo) fail('El post no tiene video.mp4');
    const url = `${SITE}/${encPath(post.carpeta, archivo)}`;
    console.log('Descargando', url);
    const r = await fetch(url);
    if (!r.ok) fail(`No pude bajar el video: HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    const md5 = crypto.createHash('md5').update(buf).digest('hex');

    // 1) pedir dirección de subida a Composio
    const req = await composio('/files/upload/request', {
      toolkit_slug: 'tiktok', tool_slug: 'TIKTOK_UPLOAD_VIDEO',
      filename: 'video.mp4', mimetype: 'video/mp4', md5,
    });
    const put = await fetch(req.new_presigned_url || req.newPresignedUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'video/mp4', ...(req.metadata && req.metadata.storage_backend === 'azure_blob_storage' ? { 'x-ms-blob-type': 'BlockBlob' } : {}) },
      body: buf,
    });
    if (!put.ok) fail(`Falló la subida del archivo a Composio: HTTP ${put.status} ${(await put.text()).slice(0, 300)}`);
    console.log('Archivo en Composio:', req.key);

    // 2) dejar el video en borradores de TikTok (publish=false => bandeja del creador)
    const out = await ejecutar('TIKTOK_UPLOAD_VIDEO', {
      file_to_upload: { name: 'video.mp4', mimetype: 'video/mp4', s3key: req.key },
      publish: false,
    });
    console.log('OK. publish_id:', out && out.publish_id);
  } else {
    const fotos = post.archivos.filter((f) => /\.jpe?g$/i.test(f)).map((f) => `${SITE}/${encPath(post.carpeta, f)}`);
    if (!fotos.length) fail('El post no tiene tarjetas JPG');
    const out = await ejecutar('TIKTOK_POST_PHOTO', {
      post_mode: 'MEDIA_UPLOAD',
      photo_images: fotos,
      photo_cover_index: 0,
      title: post.titulo.slice(0, 90),
      description: descripcion,
    });
    console.log('OK. publish_id:', out && out.publish_id);
  }
})().catch((e) => fail(e.stack || String(e)));
