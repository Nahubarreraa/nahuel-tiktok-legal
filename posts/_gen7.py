import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("34-nadie-viene",[card("Nadie va a venir a salvarte. Y esa es la mejor noticia que vas a escuchar.","vea_wanderer"),card("Si nadie viene, nadie te frena.","mn_441933"),card("Todo lo que esperás que alguien haga por vos, ya podés empezar a hacerlo.","pz_moonrise"),fin("Empezá vos.","Compartilo con el que<br>está esperando permiso.")],
 "Nadie va a venir a salvarte","Es la mejor noticia que vas a escuchar hoy. #mentalidad #disciplina #responsabilidad #motivacion #parati #fyp","Experience - Ludovico Einaudi","carrusel 4 gancho"),
("35-ocupado",[card("Estar ocupado no es lo mismo que avanzar.<br>Leelo otra vez.","mn_437586")],
 "Leelo otra vez","Revisá en qué gastás tu día. #productividad #mentalidad #prioridades #reflexion #frasesmotivadoras","Time - Hans Zimmer (piano)","video enigma"),
("36-tres-preguntas",[card("3 preguntas que te cambian el día","met437406"),card("1. ¿Qué estoy evitando?","in_bustA"),card("2. ¿Qué haría si no tuviera miedo?","mn_698749"),card("3. ¿Quién quiero ser dentro de un año?","dc_hercules2"),fin("Contestalas por escrito.","Guardalo y respondelas<br>mañana temprano.")],
 "3 preguntas que te cambian el día","¿Cuál te cuesta más contestar? #mentalidad #autoconocimiento #disciplina #motivacion #parati #fyp","River Flows in You - Yiruma","lista 5 preguntas"),
("37-barato",[card("Lo barato siempre sale caro.","cb_money"),card("La comodidad de hoy se paga con el arrepentimiento de mañana.","vd_814543"),card("Pagá el precio del esfuerzo ahora.","am_b256845"),fin("El esfuerzo se paga una vez.","Compartilo con el que<br>siempre elige lo fácil.")],
 "Lo barato sale caro","El arrepentimiento cobra intereses. #mentalidad #esfuerzo #disciplina #dinero #motivacion #fyp","Nuvole Bianche - Einaudi","carrusel 4 dinero"),
("38-lo-que-no-ves",[card("Cada vez que postergás, alguien que no conocés avanza un paso.<br>Leelo otra vez.","gq_a_raeburn")],
 "Leelo otra vez","Mientras vos esperás, otros se mueven. #mentalidad #postergar #disciplina #reflexion #frasesmotivadoras","Experience - Ludovico Einaudi","video enigma"),
("39-cansancio",[card("No estás cansado de trabajar. Estás cansado de no avanzar.","pe_hammershoi"),card("El cansancio de una vida sin rumbo pesa más que cualquier esfuerzo.","wm_world"),card("Elegí un rumbo y el cuerpo te sigue.","out_peaks")],
 "No estás cansado de trabajar","Elegí un rumbo y el cuerpo te sigue. #mentalidad #motivacion #proposito #disciplina #parati #fyp","Gymnopédie No.1 - Satie","carrusel 3 sin cierre"),
]
md=[]
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=[\n"+",\n".join(rows)+"\n];\n")
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas7.md","w",encoding="utf-8").write("\n".join(md)+"\n")
