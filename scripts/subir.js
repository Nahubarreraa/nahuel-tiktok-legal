// Sube un post de la biblioteca a los BORRADORES de TikTok a través del servidor MCP de Composio.
// Lo corre .github/workflows/subir.yml. Variables: COMPOSIO_API_KEY (clave de cuenta "ck_..."), POST_ID, SITE.
// Node 22: fetch nativo, sin dependencias.
const fs = require('fs');
const path = require('path');

const MCP = 'https://connect.composio.dev/mcp';
const KEY = process.env.COMPOSIO_API_KEY;
const SITE = (process.env.SITE || '').replace(/\/$/, '');

const fail = (m) => { console.error('ERROR: ' + m); process.exit(1); };
if (!KEY) fail('Falta el secreto COMPOSIO_API_KEY en el repositorio.');

let sid = null;
let n = 0;

async function rpc(method, params, notify = false) {
  const body = { jsonrpc: '2.0', method, params };
  if (!notify) body.id = ++n;
  const r = await fetch(MCP, {
    method: 'POST',
    headers: {
      'x-consumer-api-key': KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      ...(sid ? { 'Mcp-Session-Id': sid } : {}),
    },
    body: JSON.stringify(body),
  });
  const h = r.headers.get('mcp-session-id');
  if (h) sid = h;
  const txt = await r.text();
  if (!r.ok) fail(`MCP ${method} -> HTTP ${r.status}: ${txt.slice(0, 400)}`);
  if (notify || !txt.trim()) return null;
  // la respuesta puede venir como JSON o como evento SSE ("data: {...}")
  const dataLine = txt.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).pop();
  const msg = JSON.parse(dataLine || txt);
  if (msg.error) fail(`MCP ${method}: ${JSON.stringify(msg.error).slice(0, 500)}`);
  return msg.result;
}

async function tool(name, args) {
  const res = await rpc('tools/call', { name, arguments: args });
  const text = (res.content || []).map((c) => c.text || '').join('\n');
  if (res.isError) fail(`${name} falló: ${text.slice(0, 800)}`);
  try { return JSON.parse(text); } catch { return { raw: text }; }
}

(async () => {
  const lib = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'app/data/posts.json'), 'utf8')).posts;
  const post = lib.find((p) => String(p.id) === String(process.env.POST_ID));
  if (!post) fail('No existe el post ' + process.env.POST_ID);
  console.log(`Post #${post.id}: ${post.titulo} (${post.tipo})`);

  const enc = (f) => post.carpeta.split('/').map(encodeURIComponent).join('/') + '/' + encodeURIComponent(f);
  const job = { tipo: post.tipo };
  if (post.tipo === 'video') {
    const mp4 = post.archivos.find((f) => f.endsWith('.mp4'));
    if (!mp4) fail('El post no tiene video.mp4');
    job.url = `${SITE}/${enc(mp4)}`;
  } else {
    job.fotos = post.archivos.filter((f) => /\.jpe?g$/i.test(f)).map((f) => `${SITE}/${enc(f)}`);
    if (!job.fotos.length) fail('El post no tiene tarjetas JPG');
    job.titulo = post.titulo.slice(0, 90);
    job.descripcion = `${post.caption} ${post.hashtags.join(' ')}`.trim();
  }

  await rpc('initialize', { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'acero-subir', version: '1.0' } });
  await rpc('notifications/initialized', {}, true);

  // sesión de trabajo de Composio (también verifica la conexión de TikTok)
  const s = await tool('COMPOSIO_SEARCH_TOOLS', {
    queries: [{ use_case: 'upload a video to TikTok as draft', known_fields: 'toolkit:tiktok' }],
    session: { generate_id: true },
  });
  const sessionId = (s.data && s.data.session && s.data.session.id) || (s.session && s.session.id);
  if (!sessionId) fail('No obtuve session id de Composio: ' + JSON.stringify(s).slice(0, 500));
  const conn = ((s.data || s).toolkit_connection_statuses || []).find((t) => t.toolkit === 'tiktok');
  if (conn && !conn.has_active_connection) fail('TikTok no tiene conexión activa en Composio: ' + conn.status_message);
  console.log('Sesión Composio:', sessionId);

  // El trabajo pesado (bajar el video y subirlo a TikTok) corre en el entorno de Composio.
  const py = `
import json, requests
job = json.loads(${JSON.stringify(JSON.stringify(job))})
if job["tipo"] == "video":
    r = requests.get(job["url"], timeout=120)
    print("descarga", r.status_code, len(r.content))
    r.raise_for_status()
    open("/tmp/v.mp4", "wb").write(r.content)
    res, err = upload_local_file("/tmp/v.mp4")
    if err: raise RuntimeError(err)
    out, e2 = run_composio_tool("TIKTOK_UPLOAD_VIDEO", {
        "file_to_upload": {"name": "video.mp4", "mimetype": "video/mp4", "s3key": res["s3key"]},
        "publish": False})
else:
    out, e2 = run_composio_tool("TIKTOK_POST_PHOTO", {
        "post_mode": "MEDIA_UPLOAD", "photo_images": job["fotos"], "photo_cover_index": 0,
        "title": job["titulo"], "description": job["descripcion"]})
print("RESULT::" + json.dumps({"out": out, "err": str(e2) if e2 else None}))
`;
  const w = await tool('COMPOSIO_REMOTE_WORKBENCH', {
    code_to_execute: py,
    thought: 'Subir post a borradores de TikTok',
    session_id: sessionId,
  });
  const stdout = (w.data && w.data.stdout) || w.stdout || JSON.stringify(w);
  console.log(stdout.slice(0, 1500));
  const m = stdout.match(/RESULT::(.*)/);
  if (!m) fail('El entorno de Composio no devolvió resultado: ' + JSON.stringify(w).slice(0, 800));
  const res = JSON.parse(m[1]);
  const inner = res.out && (res.out.data && res.out.data.data ? res.out.data.data : res.out.data || res.out);
  if (res.err || !inner || !inner.publish_id) fail('TikTok no confirmó la subida: ' + JSON.stringify(res).slice(0, 800));
  console.log('OK. Quedó en borradores. publish_id:', inner.publish_id);
})().catch((e) => fail(e.stack || String(e)));
