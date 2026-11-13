// Chat de la app: interpreta un pedido, crea un post (frase + tarjeta + video), lo guarda en el repo
// y opcionalmente lo sube a los borradores de TikTok. Lo corre .github/workflows/chat.yml.
// Entorno: GITHUB_TOKEN (modelos gratis de GitHub), MENSAJE, SITE, COMPOSIO_API_KEY (para subir).
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { subirABorradores, llm } = require('./subir');

const ROOT = path.join(__dirname, '..');
const SITE = (process.env.SITE || '').replace(/\/$/, '');
const MENSAJE = (process.env.MENSAJE || '').trim();
const RESPUESTA = process.env.RESPUESTA_FILE || '/tmp/respuesta.md';

const SONIDOS = [
  'Experience - Ludovico Einaudi', 'Kiss the Rain - Yiruma', "Comptine d'un autre été - Yann Tiersen",
  'Hallelujah - piano', 'River Flows in You - Yiruma', 'Nuvole Bianche - Einaudi', 'Una Mattina - Einaudi',
];

const sh = (cmd, opts = {}) => cp.execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts });
const hoy = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const leerLib = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'app/data/posts.json'), 'utf8')).posts;

const PLATA = /\b(plata|sueldo|salario|cobrar|cobr[aá]s|ahorr\w*|dinero|billete\w*|rico|ricos|riqueza|inversi\w+|aumento)\b/i;

const SISTEMA = `Sos el editor de contenido de "Mentalidad de Acero" (@mentalidaddeacero.arg), una cuenta de TikTok argentina de fuerza mental. Hablás en español rioplatense (voseo).
El usuario te escribe desde su celular. Decidí qué pide y respondé SOLO con un JSON válido.

REGLAS DE CONTENIDO (el usuario las corrigió muchas veces, cumplilas):
- Temática: disciplina, constancia, no rendirse, miedo, dolor que construye, soledad del que avanza, levantarse tras caer, carácter, excusas, comodidad, postergar.
- PROHIBIDO hablar de plata, sueldo, cobrar, ahorro, aumento, negocios, dinero.
- Cada post = UNA frase filosa (idea propia, original, que interpele al propio comportamiento: excusas, comodidad, abandonar, postergar). Máximo 140 caracteres, idealmente 60-110. Nada de frases de consuelo ni genéricas. Sin autores antiguos ni citas de relleno. No inventes citas de personas reales.
- La frase no puede repetir ni parecerse mucho a las ya publicadas (te paso la lista).
- No pongas "compartí", "guardá" ni llamados a la acción dentro de la frase. El llamado va solo en el caption: una orden corta + "Compartilo con el que ..." (ej: "Hacelo hoy. Compartilo con el que siempre dice después.").
- Formato único: video de una tarjeta. tipo "directa" (la frase sola, titulo = 2 a 5 palabras que resuman la idea) o "enigma" (titulo "Leelo otra vez" y caption sin "Compartilo").
- Hashtags: 5 o 6, siempre #mentalidad #disciplina (o el tema) #motivacion #parati #fyp más uno o dos temáticos.
- sonido: elegí uno de esta lista (piano calmo, es lo que mejor rindió): ${SONIDOS.join(' | ')}.

ACCIONES:
- "crear": el usuario pide un post nuevo (con o sin tema). Completá "post".
- "resubir": pide volver a subir un post ya publicado (dice un número o lo describe). Poné "resubir_id".
- "responder": pregunta algo sobre lo ya publicado, o charla. Contestá en "respuesta" usando la biblioteca.
"subir": true si pide subirlo/publicarlo o si el usuario no dijo lo contrario (por defecto true); false si dice "solo armalo", "no lo subas", "mostrame primero".

FORMATO DE SALIDA (JSON, sin texto extra):
{"accion":"crear|resubir|responder","respuesta":"mensaje corto para el usuario, 1-3 oraciones","subir":true,"resubir_id":null,"post":{"titulo":"","frase":"","tipo":"directa|enigma","caption":"","hashtags":["#mentalidad"],"sonido":""}}
"post" solo si accion = crear.`;

// Modelo de lenguaje gratuito del entorno de Composio (sin claves extra). Devuelve el JSON del plan.
async function llamarModelo(mensajes) {
  const etiqueta = (m) => (m.role === 'assistant' ? 'TU RESPUESTA ANTERIOR:\n' : 'USUARIO:\n');
  const texto = mensajes.map((m) => (m.role === 'system' ? m.content : etiqueta(m) + m.content)).join('\n\n');
  const crudo = await llm(texto + '\n\nRespondé únicamente con el JSON, sin explicaciones ni bloques de código.');
  const limpio = crudo.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const ini = limpio.indexOf('{'), fin = limpio.lastIndexOf('}');
  try { return JSON.parse(limpio.slice(ini, fin + 1)); }
  catch { throw new Error('El modelo no devolvió JSON válido: ' + JSON.stringify(crudo.slice(0, 300))); }
}

function resumenBiblioteca(lib) {
  const ult = lib.filter((p) => p.estado === 'SUBIDO').slice(-70);
  const lineas = ult.map((p) => `#${p.id} "${p.titulo}" — ${p.frases[0] || p.caption}`);
  return `Total publicados: ${lib.filter((p) => p.estado === 'SUBIDO').length}. Últimos ${ult.length}:\n${lineas.join('\n')}`;
}

function envolver(frase, max = 22) {
  const out = []; let l = '';
  for (const w of frase.split(/\s+/)) {
    if ((l + ' ' + w).trim().length > max && l) { out.push(l); l = w; } else l = (l + ' ' + w).trim();
  }
  if (l) out.push(l);
  return out.join('<br>');
}

function elegirFondo() {
  const todos = fs.readdirSync(path.join(ROOT, 'fondos')).filter((f) => /\.jpg$/i.test(f));
  const usados = new Set();
  const cola = path.join(ROOT, 'posts/cola');
  const dirs = fs.readdirSync(cola).filter((d) => /^\d+-/.test(d)).sort().slice(-60);
  for (const d of dirs) {
    const cj = path.join(cola, d, 'cards.js');
    if (fs.existsSync(cj)) for (const m of fs.readFileSync(cj, 'utf8').matchAll(/fondos\/([^"']+?\.jpe?g)/gi)) usados.add(path.basename(m[1]));
  }
  const libres = todos.filter((f) => !usados.has(f));
  const pool = libres.length ? libres : todos;
  return pool[Math.floor(Math.random() * pool.length)];
}

function chrome() {
  for (const c of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser']) {
    try { sh(`command -v ${c}`); return c; } catch {}
  }
  throw new Error('No encontré Chrome en el servidor');
}

function renderizar(dir, tipoEnigma) {
  const abs = path.join(ROOT, dir);
  fs.copyFileSync(path.join(ROOT, 'tools/tarjetas/card.html'), path.join(abs, '_card.html'));
  const png = path.join(abs, '_t0.png');
  sh(`${chrome()} --headless=new --no-sandbox --disable-gpu --hide-scrollbars --allow-file-access-from-files --window-size=1080,1920 --virtual-time-budget=4000 --screenshot="${png}" "file://${path.join(abs, '_card.html')}#0"`, { timeout: 90000 });
  if (!fs.existsSync(png)) throw new Error('Chrome no generó la tarjeta');
  sh(`ffmpeg -v error -y -i "${png}" -q:v 2 "${path.join(abs, 'tarjeta_1.jpg')}"`);
  sh(`ffmpeg -v error -y -loop 1 -framerate 30 -i "${path.join(abs, 'tarjeta_1.jpg')}" -vf "scale=1080:1920,format=yuv420p" -t 9 -c:v libx264 -tune stillimage -crf 18 -movflags +faststart -an "${path.join(abs, 'video.mp4')}"`, { timeout: 120000 });
  fs.rmSync(png); fs.rmSync(path.join(abs, '_card.html'));
  for (const f of ['tarjeta_1.jpg', 'video.mp4']) if (!fs.existsSync(path.join(abs, f)) || fs.statSync(path.join(abs, f)).size < 20000) throw new Error('Salida inválida: ' + f);
}

function guardarCola(id, dir, p, estado) {
  const f = path.join(ROOT, 'posts/cola/COLA.md');
  let md = fs.readFileSync(f, 'utf8').replace(/\s+$/, '') + '\n';
  const titulo = `## Lote ${hoy()} (app del celular)`;
  if (!md.includes(titulo)) md += `\n${titulo}\n\n| # | Carpeta | Título | Descripción | Formato | Sonido pedido | Estado |\n|---|---|---|---|---|---|---|\n`;
  md += `| ${id} | \`${dir}\` | ${p.titulo} | ${p.caption} ${p.hashtags.join(' ')} | ${p.tipo === 'enigma' ? 'video enigma' : 'video'} | ${p.sonido} | ${estado} |\n`;
  fs.writeFileSync(f, md);
}

function marcarSubido(id) {
  const f = path.join(ROOT, 'posts/cola/COLA.md');
  const md = fs.readFileSync(f, 'utf8').split('\n').map((l) => (l.startsWith(`| ${id} |`) ? l.replace(/PENDIENTE\s*\|$/, `SUBIDO ${hoy()} (borrador) |`) : l)).join('\n');
  fs.writeFileSync(f, md);
}

function publicarCambios(msg) {
  sh('git config user.name "Nahuel" && git config user.email "barreranahuel269@gmail.com"');
  sh('node tools/build-library.js');
  sh('git add posts/cola app/data fondos');
  try { sh('git diff --cached --quiet'); return; } catch {}
  sh(`git commit -q -m "${msg}\n\nCo-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"`);
  for (let i = 0; i < 4; i++) {
    try { sh('git pull -q --rebase origin main && git push -q origin main'); return; } catch (e) { if (i === 3) throw e; }
  }
}

async function esperarSitio(url) {
  for (let i = 0; i < 40; i++) {
    const r = await fetch(url, { method: 'HEAD' }).catch(() => null);
    if (r && r.ok) return true;
    await new Promise((res) => setTimeout(res, 10000));
  }
  return false;
}

const responder = (texto) => { fs.writeFileSync(RESPUESTA, texto); console.log('\n--- RESPUESTA ---\n' + texto); };

(async () => {
  if (!MENSAJE) throw new Error('Mensaje vacío');
  const lib = leerLib();
  const mensajes = [
    { role: 'system', content: SISTEMA },
    { role: 'user', content: `BIBLIOTECA ACTUAL\n${resumenBiblioteca(lib)}\n\nPEDIDO DEL USUARIO:\n${MENSAJE}` },
  ];

  let plan = await llamarModelo(mensajes);
  console.log('Plan:', JSON.stringify(plan).slice(0, 600));

  if (plan.accion === 'crear') {
    const existentes = new Set(lib.flatMap((p) => p.frases.map(norm)));
    for (let intento = 0; intento < 3; intento++) {
      const p = plan.post || {};
      let problema = '';
      if (!p.frase || p.frase.length > 160) problema = 'La frase falta o supera 140 caracteres.';
      else if (PLATA.test(p.frase + ' ' + (p.caption || ''))) problema = 'Habla de plata/dinero, está prohibido.';
      else if (existentes.has(norm(p.frase))) problema = 'La frase ya fue publicada.';
      else if (!/Compartilo/.test(p.caption || '') && p.tipo !== 'enigma') problema = 'Al caption le falta "Compartilo con el que ...".';
      if (!problema) break;
      if (intento === 2) throw new Error('No logré una frase válida: ' + problema);
      console.log('Reintento por:', problema);
      mensajes.push({ role: 'assistant', content: JSON.stringify(plan) }, { role: 'user', content: `Rechazado: ${problema} Devolvé el JSON completo corregido, con otra frase.` });
      plan = await llamarModelo(mensajes);
    }
    const p = plan.post;
    p.hashtags = (p.hashtags || []).map((h) => (h.startsWith('#') ? h : '#' + h)).slice(0, 6);
    p.sonido = p.sonido || SONIDOS[0];
    p.titulo = p.tipo === 'enigma' ? 'Leelo otra vez' : p.titulo.slice(0, 60);

    const id = Math.max(...lib.map((x) => x.id)) + 1;
    const dir = `posts/cola/${id}-${slug(p.tipo === 'enigma' ? p.frase.split(' ').slice(0, 4).join(' ') : p.titulo)}`;
    fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
    const fondo = elegirFondo();
    const q = envolver(p.frase.replace(/"/g, '\\"'));
    fs.writeFileSync(path.join(ROOT, dir, 'cards.js'),
      `window.CARDS=[\n{q:"${q}",${p.tipo === 'enigma' ? 'cta:"Leelo otra vez.",' : ''}a:"Mentalidad de Acero",bg:"../../../fondos/${fondo}"}\n];\n`);
    renderizar(dir);
    guardarCola(id, dir, p, 'PENDIENTE');
    publicarCambios(`Post ${id} creado desde la app: ${p.titulo}`);

    let estadoSubida = 'Quedó guardado en la cola (no lo subí).';
    if (plan.subir !== false) {
      const url = `${SITE}/${dir.split('/').map(encodeURIComponent).join('/')}/video.mp4`;
      console.log('Esperando que el sitio publique', url);
      if (!(await esperarSitio(url))) throw new Error('El video tardó demasiado en estar disponible en la web.');
      const post = leerLib().find((x) => x.id === id);
      await subirABorradores(post, SITE);
      marcarSubido(id);
      publicarCambios(`Post ${id} subido a borradores`);
      estadoSubida = '**Ya está en tus borradores de TikTok.** Abrí TikTok, ponele el sonido y publicalo.';
    }
    responder(`${plan.respuesta || ''}\n\n**#${id} · ${p.titulo}**\n> ${p.frase}\n\n${p.caption} ${p.hashtags.join(' ')}\n\n♪ Sonido sugerido: ${p.sonido}\n\n${estadoSubida}\n\n![tarjeta](${SITE}/${dir.split('/').map(encodeURIComponent).join('/')}/tarjeta_1.jpg)`);
  } else if (plan.accion === 'resubir') {
    const post = lib.find((x) => x.id === Number(plan.resubir_id));
    if (!post) throw new Error('No encontré el post #' + plan.resubir_id);
    await subirABorradores(post, SITE);
    responder(`${plan.respuesta || ''}\n\nVolví a subir **#${post.id} · ${post.titulo}** a tus borradores de TikTok.`);
  } else {
    responder(plan.respuesta || 'No entendí el pedido, ¿me lo decís de otra forma?');
  }
})().catch((e) => {
  console.error('ERROR: ' + e.message);
  fs.writeFileSync(RESPUESTA, `No pude completar el pedido.\n\n\`${e.message.slice(0, 500)}\``);
  process.exit(1);
});
