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

const sh = (cmd, opts = {}) => {
  try { return cp.execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8', ...opts }); }
  catch (e) { throw new Error(`${String(e.message).slice(0, 160)} :: ${String(e.stderr || '').slice(0, 500)}`); }
};
const git = (...args) => {
  try { return cp.execFileSync('git', args, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' }); }
  catch (e) { throw new Error(`git ${args[0]} falló :: ${String(e.stderr || e.message).slice(0, 400)}`); }
};
const hoy = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const leerLib = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'app/data/posts.json'), 'utf8')).posts;

// Sube a borradores salvo que el usuario diga lo contrario (no confiamos en la decisión del modelo).
const NO_SUBIR = /no (lo )?(subas|subir|publiques)|sin subir|solo arm[aá]|nom[aá]s arm[aá]|mostr[aá]me primero|NO subir a TikTok/i;
const PLATA = /\b(plat[ao]s?|sueld|salari|cobr|ahorr|dinero|guita|lucas|billete|ricos?|riqueza|millon|invers|invert|deuda|factur)/i;

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
  const ult = lib.filter((p) => p.estado !== 'DESCARTADO').slice(-70);
  const est = (p) => (p.estado === 'PENDIENTE' ? 'EN COLA, sin subir' : p.borrador ? 'en borradores de TikTok' : 'publicado');
  const lineas = ult.map((p) => `#${p.id} [${est(p)}] "${p.titulo}" — ${p.frases[0] || p.caption}`);
  return `Total: ${lib.length} posts (${lib.filter((p) => p.estado === 'PENDIENTE').length} en cola sin subir). Últimos ${ult.length}:\n${lineas.join('\n')}`;
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
  const dirs = fs.readdirSync(cola).filter((d) => /^\d+-/.test(d)).sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).slice(-60);
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
  console.log('PNG', fs.statSync(png).size, 'bytes');
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
  const li = (v) => String(v).replace(/[|\r\n]+/g, ' ').trim();
  md += `| ${id} | \`${dir}\` | ${li(p.titulo)} | ${li(p.caption)} ${p.hashtags.map(li).join(' ')} | ${p.tipo === 'enigma' ? 'video enigma' : 'video'} | ${li(p.sonido)} | ${estado} |\n`;
  fs.writeFileSync(f, md);
}

function marcarSubido(id) {
  const f = path.join(ROOT, 'posts/cola/COLA.md');
  const md = fs.readFileSync(f, 'utf8').split('\n').map((l) => (l.startsWith(`| ${id} |`) ? l.replace(/PENDIENTE\s*\|$/, `SUBIDO ${hoy()} (borrador) |`) : l)).join('\n');
  fs.writeFileSync(f, md);
}

function publicarCambios(msg) {
  git('config', 'user.name', 'Nahuel');
  git('config', 'user.email', 'barreranahuel269@gmail.com');
  sh('node tools/build-library.js');
  git('add', 'posts/cola', 'app/data', 'fondos');
  try { git('diff', '--cached', '--quiet'); return; } catch {}
  git('commit', '-q', '-m', `${String(msg).replace(/[\r\n]+/g, ' ')}\n\nCo-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`);
  for (let i = 0; i < 4; i++) {
    try {
      const antes = git('rev-parse', 'origin/main').trim();
      git('pull', '-q', '--rebase', 'origin', 'main');
      if (git('rev-parse', 'origin/main').trim() !== antes) {
        // Llegaron commits de otro lado (p. ej. el chat de Code): regenerar posts.json con todo.
        sh('node tools/build-library.js');
        try { git('diff', '--quiet', '--', 'app/data'); } catch { git('add', 'app/data'); git('commit', '-q', '-m', 'Regenerar biblioteca'); }
      }
      git('push', '-q', 'origin', 'main');
      return;
    } catch (e) {
      try { git('rebase', '--abort'); } catch {}
      if (i === 3) throw e;
      cp.execSync(`sleep ${2 + i * 3}`);
    }
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


const clampN = (n) => Math.max(1, Math.min(5, n || 1));
const PALABRAS = { un: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5 };
// Cuántos posts pide el usuario: "(Cantidad: 3)" de la app, o texto libre ("subime 3", "tres posts").
function cantidadDe(m) {
  const t = /\(Cantidad: (\d{1,2})\)/.exec(m);
  if (t) return clampN(+t[1]);
  const w = /\b(un|uno|dos|tres|cuatro|cinco)\s+posts?\b/i.exec(m);
  if (w) return clampN(PALABRAS[w[1].toLowerCase()]);
  const r = /(?:sub[ií]me|cre[aá](?:me)?|hac[eé](?:me)?|arm[aá](?:me)?|mand[aá](?:me)?)\s+(?:de una\s+)?(\d{1,2})\b/i.exec(m) || /\b(\d{1,2})\s+posts?\b/i.exec(m);
  return r ? clampN(+r[1]) : 1;
}

// Valida el post del plan; si falla pide otro al modelo (hasta 3 intentos).
async function obtenerPost(plan, mensajes, existentes) {
  const msgs = mensajes.slice();
  for (let intento = 0; intento < 3; intento++) {
    const p = plan.post || {};
    let problema = '';
    const txt = (v) => (typeof v === 'string' ? v.trim() : '');
    p.frase = txt(p.frase); p.caption = txt(p.caption); p.titulo = txt(p.titulo);
    p.hashtags = (Array.isArray(p.hashtags) ? p.hashtags : []).map(String);
    if (!p.frase || p.frase.length > 140) problema = 'La frase falta o supera 140 caracteres.';
    else if (/compart[ií]|guard[aá]|segu[ií]me|coment[aá]/i.test(p.frase)) problema = 'La frase no puede tener llamados a la acción (compartí, guardá, seguime).';
    else if (PLATA.test([p.frase, p.titulo, p.caption, p.hashtags.join(' ')].join(' '))) problema = 'Habla de plata/dinero, está prohibido.';
    else if (existentes.has(norm(p.frase))) problema = 'La frase ya fue publicada.';
    else if (p.tipo !== 'enigma' && !/Compartilo con el que/i.test(p.caption)) problema = 'Al caption le falta "Compartilo con el que ...".';
    if (!problema) {
      p.hashtags = (p.hashtags || []).map((h) => (h.startsWith('#') ? h : '#' + h)).slice(0, 6);
      p.sonido = p.sonido || SONIDOS[0];
      p.titulo = p.tipo === 'enigma' ? 'Leelo otra vez' : String(p.titulo || 'Sin título').slice(0, 60);
      return p;
    }
    if (intento === 2) throw new Error('No logré una frase válida: ' + problema);
    console.log('Reintento por:', problema);
    msgs.push({ role: 'assistant', content: JSON.stringify(plan) }, { role: 'user', content: `Rechazado: ${problema} Devolvé el JSON completo corregido, con otra frase.` });
    plan = await llamarModelo(msgs);
  }
}

const responder = (texto) => { fs.writeFileSync(RESPUESTA, texto); console.log('\n--- RESPUESTA ---\n' + texto); };

// Avisos de progreso: comentarios "[[paso:N]] texto" en el issue; la app los muestra como barra de pasos.
const REPO = process.env.GITHUB_REPOSITORY || 'Nahubarreraa/nahuel-tiktok-legal';
const ISSUE = process.env.ISSUE_NUMBER;
async function progreso(paso, texto) {
  console.log(`[paso ${paso}] ${texto}`);
  if (!ISSUE || !process.env.GITHUB_TOKEN) return;
  try {
    await fetch(`https://api.github.com/repos/${REPO}/issues/${ISSUE}/comments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: `[[paso:${paso}]] ${texto}` }),
    });
  } catch {}
}
const COMO_ABRIR = '**TikTok ya lo tiene.** Abrí la app de TikTok (con la cuenta @mentalidaddeacero.arg) → Bandeja de entrada → tocá el aviso de tu video. Ahí le ponés el sonido y lo publicás.';

(async () => {
  if (!MENSAJE) throw new Error('Mensaje vacío');
  const lib = leerLib();
  const mensajes = [
    { role: 'system', content: SISTEMA },
    { role: 'user', content: `BIBLIOTECA ACTUAL\n${resumenBiblioteca(lib)}\n\nPEDIDO DEL USUARIO:\n${MENSAJE}` },
  ];

  await progreso(1, 'Pensando la frase');
  let plan = await llamarModelo(mensajes);
  console.log('Plan:', JSON.stringify(plan).slice(0, 600));

  if (plan.accion === 'crear') {
    const N = cantidadDe(MENSAJE);
    const existentes = new Set(lib.flatMap((p) => p.frases.map(norm)));
    let siguiente = Math.max(...lib.map((x) => x.id)) + 1;
    const hechos = []; // { id, dir, p }
    const errores = [];
    const base = mensajes[1].content;

    for (let k = 0; k < N; k++) {
      let dirCreado = null;
      try {
        if (k > 0) {
          await progreso(1, `Pensando la frase ${k + 1} de ${N}`);
          const ya = hechos.map((h) => `- ${h.p.frase}`).join('\n');
          mensajes[1] = { role: 'user', content: `${base}\n\nIMPORTANTE: en este mismo pedido ya armaste estas frases, hacé una DISTINTA (otro ángulo, otras palabras):\n${ya}` };
          plan = await llamarModelo(mensajes.slice(0, 2));
        }
        const p = await obtenerPost(plan, mensajes.slice(0, 2), existentes);
        const id = siguiente;
        const dir = `posts/cola/${id}-${slug(p.tipo === 'enigma' ? p.frase.split(' ').slice(0, 4).join(' ') : p.titulo) || 'post'}`;
        fs.mkdirSync(path.join(ROOT, dir), { recursive: true });
        dirCreado = dir;
        const fondo = elegirFondo();
        const q = envolver(p.frase);
        fs.writeFileSync(path.join(ROOT, dir, 'cards.js'),
          `window.CARDS=[\n{q:${JSON.stringify(q)},${p.tipo === 'enigma' ? 'cta:"Leelo otra vez.",' : ''}a:"Mentalidad de Acero",bg:"../../../fondos/${fondo}"}\n];\n`);
        await progreso(2, N > 1 ? `Armando la tarjeta y el video ${k + 1} de ${N}` : 'Armando la tarjeta y el video');
        renderizar(dir);
        guardarCola(id, dir, p, 'PENDIENTE'); // lo último: si algo falla antes, no queda fila a medias
        existentes.add(norm(p.frase));
        siguiente++;
        hechos.push({ id, dir, p });
      } catch (e) {
        // Un post que falla no tira abajo a los demás del lote.
        console.log(`Falló el post ${k + 1} de ${N}:`, e.message);
        errores.push(e.message);
        if (dirCreado) fs.rmSync(path.join(ROOT, dirCreado), { recursive: true, force: true });
      }
    }
    if (!hechos.length) throw new Error('No pude armar ningún post. ' + (errores[0] || ''));

    await progreso(3, N > 1 ? `Guardando los ${hechos.length} posts` : 'Guardando el post');
    const ids = hechos.map((h) => h.id);
    publicarCambios(hechos.length > 1 ? `Posts ${ids[0]}-${ids[ids.length - 1]} creados desde la app` : `Post ${ids[0]} creado desde la app: ${hechos[0].p.titulo}`);

    const enviar = !NO_SUBIR.test(MENSAJE);
    const fallas = [];
    const subidos = new Set();
    if (enviar) {
      try {
        const ult = hechos[hechos.length - 1];
        const url = `${SITE}/${ult.dir.split('/').map(encodeURIComponent).join('/')}/video.mp4`;
        await progreso(4, 'Esperando que el video esté listo en la web');
        console.log('Esperando que el sitio publique', url);
        if (!(await esperarSitio(url))) {
          // No se tira error: los posts ya están creados; el usuario puede mandarlos después sin duplicarlos.
          for (const h of hechos) fallas.push({ id: h.id, error: 'El video tardó demasiado en estar disponible en la web.' });
        } else {
          for (let k = 0; k < hechos.length; k++) {
            const h = hechos[k];
            await progreso(4, hechos.length > 1 ? `Enviando a TikTok (${k + 1} de ${hechos.length})` : 'Enviando a TikTok');
            try {
              const post = leerLib().find((x) => x.id === h.id);
              await subirABorradores(post, SITE);
              marcarSubido(h.id);
              subidos.add(h.id);
            } catch (e) {
              console.log('Falló el envío del post', h.id, e.message);
              fallas.push({ id: h.id, error: e.message });
              if (/spam_risk|too_many_pending|429/i.test(e.message)) break; // TikTok no deja mandar más
            }
            if (k < hechos.length - 1) await new Promise((res) => setTimeout(res, 4000));
          }
        }
      } finally {
        if (subidos.size) publicarCambios(`Posts ${[...subidos].join(', ')} enviados a TikTok`);
      }
    }

    const resultados = hechos.map((h) => ({
      id: h.id, titulo: h.p.titulo, frase: h.p.frase, caption: h.p.caption, hashtags: h.p.hashtags, sonido: h.p.sonido,
      subido: subidos.has(h.id), img: `${SITE}/${h.dir.split('/').map(encodeURIComponent).join('/')}/tarjeta_1.jpg`,
    }));
    const lista = resultados.map((r) => `**#${r.id} · ${r.titulo}**\n> ${r.frase}\n\n${r.caption} ${r.hashtags.join(' ')}\n\n♪ Sonido sugerido: ${r.sonido}`).join('\n\n---\n\n');
    const pend = hechos.filter((h) => !subidos.has(h.id));
    let estado;
    if (!enviar) estado = `Quedó guardado en la cola (no lo mandé a TikTok). Cuando quieras, decime "subí el ${ids[0]}".`;
    else if (!pend.length) estado = COMO_ABRIR;
    else {
      const motivo = fallas[0]
        ? (/spam_risk|too_many_pending/i.test(fallas[0].error) ? 'TikTok tiene demasiados envíos pendientes: publicá o descartá los avisos de tu Bandeja de entrada y volvé a pedirlos.' : fallas[0].error.slice(0, 200))
        : 'No se llegaron a enviar.';
      estado = `${subidos.size ? COMO_ABRIR + '\n\n' : ''}**No pude mandar ${pend.map((h) => '#' + h.id).join(', ')}.** ${motivo} Los posts quedaron guardados: podés mandarlos con el botón "Mandarlo a TikTok".`;
    }
    if (hechos.length < N) estado = `Pude armar ${hechos.length} de ${N} posts (el resto falló).\n\n${estado}`;
    responder(`${hechos.length > 1 ? `Listo, armé ${hechos.length} posts.` : 'Listo, armé el post.'}\n\n${lista}\n\n${estado}\n\n<!--RESULT ${JSON.stringify(hechos.length > 1 ? resultados : resultados[0])}-->`);
  } else if (plan.accion === 'resubir') {
    const post = lib.find((x) => x.id === Number(plan.resubir_id));
    if (!post) throw new Error('No encontré el post #' + plan.resubir_id);
    await progreso(4, 'Enviando a TikTok');
    await subirABorradores(post, SITE);
    if (post.estado === 'PENDIENTE') { marcarSubido(post.id); publicarCambios(`Post ${post.id} subido a borradores`); }
    const portada = post.archivos.find((f) => /\.jpe?g$/i.test(f));
    const img = portada ? `${SITE}/${post.carpeta.split('/').map(encodeURIComponent).join('/')}/${portada}` : '';
    const resultado = { id: post.id, titulo: post.titulo, frase: post.frases[0] || '', caption: post.caption, hashtags: post.hashtags, sonido: post.sonido, subido: true, img };
    responder(`Volví a enviar **#${post.id} · ${post.titulo}** a TikTok.\n\n${COMO_ABRIR}\n\n<!--RESULT ${JSON.stringify(resultado)}-->`);
  } else {
    responder(plan.respuesta || 'No entendí el pedido, ¿me lo decís de otra forma?');
  }
})().catch((e) => {
  console.error('ERROR: ' + e.message);
  fs.writeFileSync(RESPUESTA, `No pude completar el pedido.\n\n\`${e.message.slice(0, 500)}\``);
  process.exit(1);
});
