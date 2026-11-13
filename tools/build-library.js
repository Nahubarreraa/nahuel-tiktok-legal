// Genera app/data/posts.json a partir de posts/cola/COLA.md y las carpetas de cada post.
// Uso: node tools/build-library.js
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const cola = fs.readFileSync(path.join(root, 'posts/cola/COLA.md'), 'utf8').split(/\r?\n/);

const posts = [];
let header = null;
let lote = '';

const GENERICOS = new Set(['#mentalidad','#motivacion','#parati','#fyp','#frases','#frasesmotivadoras','#reflexion','#crecimientopersonal']);
const TEMA = {
  disciplina: 'Disciplina', constancia: 'Constancia', resiliencia: 'Resiliencia', superacion: 'Superación', fracaso: 'Superación',
  postergar: 'Postergar', excusas: 'Excusas', cambio: 'Cambio', valentia: 'Valentía', miedo: 'Miedo', fortaleza: 'Fortaleza',
  fuerzamental: 'Fuerza mental', paz: 'Paz y calma', calma: 'Paz y calma', madurez: 'Paz y calma', atencion: 'Enfoque', enfoque: 'Enfoque',
  estoicismo: 'Estoicismo', estoico: 'Estoicismo', confianza: 'Confianza', honestidad: 'Honestidad', soledad: 'Soledad',
  dinero: 'Dinero', finanzas: 'Dinero', trabajo: 'Dinero', valor: 'Dinero', emprender: 'Dinero', ahorro: 'Dinero',
  familia: 'Familia', salud: 'Salud', gratitud: 'Gratitud', incomodidad: 'Incomodidad', zonadeconfort: 'Incomodidad', accion: 'Acción',
};
const estilosDe = (formato) => {
  const f = formato.toLowerCase(), e = [];
  if (/enigma/.test(f)) e.push('Enigma (leelo otra vez)');
  if (/lista/.test(f)) e.push('Lista');
  if (/pregunta/.test(f)) e.push('Pregunta');
  if (/estoic/.test(f)) e.push('Estoico');
  if (/caso|gancho|winner/.test(f)) e.push('Gancho / caso');
  if (!e.length) e.push(/^video/.test(f) ? 'Frase directa' : 'Carrusel de frases');
  return e;
};
const clean = (s) => s.replace(/`/g, '').trim();

for (const line of cola) {
  if (line.startsWith('## ')) { lote = line.slice(3).trim(); continue; }
  if (!line.startsWith('|')) { header = null; continue; }
  const cells = line.split('|').slice(1, -1).map((c) => c.trim());
  if (cells[0] === '#') { header = cells.map((h) => h.toLowerCase()); continue; }
  if (/^-+$/.test(cells[0].replace(/\s/g, '')) || !header || !/^\d+$/.test(cells[0])) continue;

  const get = (...names) => {
    for (const n of names) {
      const i = header.findIndex((h) => h.startsWith(n));
      if (i >= 0) return cells[i] || '';
    }
    return '';
  };

  const carpeta = clean(get('carpeta'));
  const descripcionFull = get('descripci');
  const hashtags = (descripcionFull.match(/#[\p{L}\p{N}_]+/gu) || []);
  const caption = descripcionFull.replace(/#[\p{L}\p{N}_]+/gu, '').trim();
  const estado = get('estado');
  const subido = (estado.match(/SUBIDO\s+(\d{4}-\d{2}-\d{2})/) || [])[1] || null;

  // frase de la tarjeta (cards.js) y archivos
  let frases = [];
  let dir = path.join(root, carpeta);
  if (!fs.existsSync(dir)) {
    // acentos en distinta normalización unicode
    const base = path.join(root, path.dirname(carpeta));
    const dirs = fs.readdirSync(base);
    const hit = dirs.find((d) => d.normalize('NFC') === path.basename(carpeta).normalize('NFC'))
      || dirs.find((d) => d.startsWith(cells[0] + '-'));
    if (hit) dir = path.join(base, hit);
  }
  let archivos = [];
  if (fs.existsSync(dir)) {
    archivos = fs.readdirSync(dir).filter((f) => /\.(jpg|jpeg|png|mp4)$/i.test(f)).sort();
    const cj = path.join(dir, 'cards.js');
    if (fs.existsSync(cj)) {
      const txt = fs.readFileSync(cj, 'utf8');
      frases = [...txt.matchAll(/\bq:\s*"((?:[^"\\]|\\.)*)"/g)].map((m) =>
        m[1].replace(/<br\s*\/?>/g, ' ').replace(/\\"/g, '"').replace(/\s+/g, ' ').trim());
    }
  }

  posts.push({
    id: Number(cells[0]),
    carpeta: path.posix.join(path.posix.dirname(carpeta), path.basename(dir)),
    titulo: get('título', 'titulo'),
    caption,
    hashtags,
    formato: get('formato') || 'carrusel',
    sonido: get('sonido'),
    temas: [...new Set(hashtags.filter((h) => !GENERICOS.has(h)).map((h) => TEMA[h.slice(1).toLowerCase()] || null).filter(Boolean))],
    estilos: estilosDe(get('formato') || 'carrusel'),
    tipo: /^video/i.test(get('formato')) ? 'video' : 'carrusel',
    estado: subido ? 'SUBIDO' : /DESCARTADO/i.test(estado) ? 'DESCARTADO' : 'PENDIENTE',
    subido,
    lote,
    frases,
    archivos,
  });
}

posts.sort((a, b) => a.id - b.id);
const out = path.join(root, 'app/data/posts.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ generado: new Date().toISOString(), posts }, null, 1));
const pend = posts.filter((p) => p.estado === 'PENDIENTE').length;
console.log(`${posts.length} posts (${pend} pendientes) -> ${path.relative(root, out)}`);
