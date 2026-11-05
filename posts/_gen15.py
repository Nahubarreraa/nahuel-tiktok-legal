import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def card3(q,b,c): return '{q:"%s",cta:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),c,A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("77-dos-dolores",[card("Hay dos dolores: el de la disciplina y el del arrepentimiento. Uno pesa gramos. El otro, toneladas.","mi_wave")],
 "Los dos dolores","Elegí cuál vas a cargar. Compartilo con el que lo está pensando. #mentalidad #disciplina #arrepentimiento #motivacion #parati #fyp","Experience - Ludovico Einaudi","video dos dolores"),
("78-no-podes-fallar",[card("¿Qué harías si supieras que no podés fallar?","cf_gericault"),card("Eso que pensaste es justo lo que deberías estar haciendo.","pe_courbet"),card("El miedo a fallar sale más caro que fallar.","dc_peaks"),card("Fallá. Pero hacé algo.","out_fog")],
 "¿Qué harías si no pudieras fallar?","Contame qué pensaste. Compartilo con el que tiene un sueño guardado. #mentalidad #miedo #valentia #motivacion #parati #fyp","Kiss the Rain - Yiruma","carrusel 4 pregunta portada"),
("79-seis-meses",[card3("Lo que hoy te cuesta, en seis meses va a ser tu rutina.","cv_397609","Leelo otra vez.")],
 "Leelo otra vez","Empezá lo que te cuesta. #mentalidad #disciplina #habitos #reflexion #frasesmotivadoras","Hallelujah - piano","video enigma"),
("80-frases-fracaso",[card("5 frases que se dice el que va a fracasar","eh_knight"),card("1. Cuando tenga tiempo.","mi_monk"),card("2. Mañana empiezo.","ga_writer"),card("3. No es el momento.","am_c3"),card("4. Ya es tarde.","tv_scholar"),card("5. Todas son miedo disfrazado.","vd_814565")],
 "5 frases del que va a fracasar","¿Cuál te dijiste esta semana? Compartilo con el que las usa. #mentalidad #disciplina #miedo #postergar #motivacion #fyp","Nuvole Bianche - Einaudi","lista 6 remate oscuro"),
("81-caracter",[card("El carácter es lo que hacés cuando nadie te ve y nadie te aplaude.","cv_391820")],
 "El carácter","Se forma en silencio. Compartilo con el que trabaja sin que lo vean. #mentalidad #caracter #disciplina #motivacion #parati #fyp","Comptine d'un autre été - Yann Tiersen","video caracter"),
("82-depende-de-vos",[card("Hay cosas que dependen de vos y cosas que no.","so_ribera"),card("Gastar energía en las segundas es la forma más cara de cansarse.","sl_1"),card("Ocupate de lo tuyo. Soltá el resto.","dc_fog")],
 "Lo que depende de vos","Soltá lo que no controlás. Compartilo con el que anda agotado. #estoicismo #mentalidad #calma #disciplina #parati #fyp","Gymnopédie No.1 - Satie","carrusel 3 estoico"),
("83-barco-puerto",[card3("Un barco en el puerto está seguro. Pero no lo construyeron para eso.","pe_vlieger","Leelo otra vez.")],
 "Leelo otra vez","Salí del puerto. #mentalidad #valentia #crecimiento #reflexion #frasesmotivadoras","Hallelujah - piano","video enigma"),
("84-nadie-admira",[card("Nadie admira al que la tuvo fácil.","es_carracci"),card("Admiramos al que se cayó mil veces y siguió.","es_manet"),card("Entonces, ¿por qué le escapás a lo difícil?","li_door"),card("Lo difícil es lo que te hace alguien.","ex_1")],
 "Nadie admira al que la tuvo fácil","Lo difícil te forma. Compartilo con el que está pasando por algo difícil. #mentalidad #resiliencia #esfuerzo #disciplina #motivacion #fyp","River Flows in You - Yiruma","carrusel 4"),
("85-descansar",[card("Descansar no es rendirse. Rendirse es no volver.","ac_walkers")],
 "Descansar no es rendirse","Descansá si lo necesitás. Pero volvé. Compartilo con el que está agotado. #mentalidad #constancia #resiliencia #motivacion #parati #fyp","Kiss the Rain - Yiruma","video constancia"),
("86-manana",[card("¿Cuántas veces te dijiste mañana esta semana?","hb_1n"),card("Mañana es la mentira más usada del mundo.","pn_1"),card("Cada mañana que postergás es una versión tuya que nunca existió.","po_man"),card("Hoy es el único día que podés cambiar.","t_seine")],
 "¿Cuántos mañanas llevás?","Hoy es el día. Compartilo con el que siempre dice mañana. #mentalidad #disciplina #postergar #motivacion #parati #fyp","Nuvole Bianche - Einaudi","carrusel 4 pregunta portada"),
]
md=[]
NL=chr(10)
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=["+NL+(","+NL).join(rows)+NL+"];"+NL)
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas15.md","w",encoding="utf-8").write(NL.join(md)+NL)
