import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def card2(q,b): return '{q:"%s",cta:"Leelo otra vez.",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def card2(q,b): return '{q:"%s",cta:"Leelo otra vez.",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("46-mito-realidad",[card("Lo que te dicen vs. lo que pasa","mn_436485"),card("Mito: necesitás motivación.<br>Realidad: necesitás un hábito.","in_bust2"),card("Mito: el talento decide.<br>Realidad: decide quien sigue.","met248142"),fin("Mito: es tarde.<br>Realidad: es hoy.","Guardalo y compartilo con<br>el que cree que es tarde.")],
 "Mito vs. realidad","¿Cuál creías vos? #mentalidad #disciplina #habitos #motivacion #parati #fyp","Experience - Ludovico Einaudi","lista mito/realidad 4"),
("47-silencio",[card2("Los que más crecen hablan poco de lo que hacen.","in_bustB")],
 "Leelo otra vez","El silencio también es estrategia. #mentalidad #disciplina #reflexion #crecimiento #frasesmotivadoras","Gymnopédie No.1 - Satie","video enigma"),
("48-dos-lobos",[card("Hay dos versiones tuyas: la que empieza y la que posterga.","vea_caspian"),card("La que gana es la que alimentás todos los días.","dc_fog"),card("Hoy, ¿a cuál le diste de comer?","pz_dahl")],
 "Hay dos versiones tuyas","¿A cuál alimentaste hoy? #mentalidad #disciplina #habitos #motivacion #parati #fyp","Nuvole Bianche - Einaudi","carrusel 3 pregunta"),
("49-ejemplo",[card("No hace falta que te lo digan. Hacelo y que te copien.","am_b251198"),card("Los hijos, los amigos, los equipos: todos aprenden mirando.","am_prom"),card("Dá el ejemplo antes que el consejo.","in_mount"),fin("Sé el ejemplo.","Compartilo con quien<br>inspira sin hablar.")],
 "Dá el ejemplo","Los demás aprenden mirando. #mentalidad #liderazgo #ejemplo #disciplina #motivacion #fyp","River Flows in You - Yiruma","carrusel 4"),
("50-ya-sabes",[card2("Ya sabés lo que tenés que hacer. Solo te falta hacerlo.","vea_wanderer")],
 "Leelo otra vez","Saber no alcanza. #mentalidad #accion #disciplina #reflexion #frasesmotivadoras","Comptine d'un autre été - Yann Tiersen","video enigma"),
("51-tres-habitos",[card("3 hábitos que cambian tu vida en 90 días","met437406"),card("1. Despertarte a la misma hora.","dc_steps"),card("2. Mover el cuerpo todos los días.","out_athlete"),card("3. Leer 10 páginas antes de dormir.","po_studio"),fin("Elegí uno y empezá hoy.","Guardalo y compartilo con<br>quien necesita ordenarse.")],
 "3 hábitos que cambian tu vida","¿Cuál empezás hoy? #mentalidad #habitos #rutina #motivacion #parati #fyp","Kiss the Rain - Yiruma","lista 5"),
]
md=[]
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=[\n"+",\n".join(rows)+"\n];\n")
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas10.md","w",encoding="utf-8").write("\n".join(md)+"\n")
