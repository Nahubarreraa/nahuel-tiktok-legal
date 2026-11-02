import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def card2(q,b): return '{q:"%s",cta:"Leelo otra vez.",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("40-nadie-lo-hace",[card("Todos quieren los resultados de los que se levantan temprano. Pocos quieren levantarse.","vea_mountain"),card("La motivación te hace empezar. La rutina te hace terminar.","pz_whistler"),card("No esperes ganas. Las ganas llegan después de moverte.","dc_steps"),fin("Movete primero.","Compartilo con el que<br>espera tener ganas.")],
 "Todos quieren el resultado","Las ganas llegan después de moverte. #mentalidad #disciplina #habitos #motivacion #parati #fyp","Experience - Ludovico Einaudi","carrusel 4 gancho"),
("41-version",[card2("La persona que querés ser ya está decidiendo lo que hacés hoy.","gq_a_rembrandt")],
 "Leelo otra vez","Tu futuro se arma con lo de hoy. #mentalidad #identidad #disciplina #reflexion #frasesmotivadoras","Comptine d'un autre été - Yann Tiersen","video enigma"),
("42-cinco-minutos",[card("5 señales de que estás creciendo aunque no lo notes","mn_436653"),card("1. Ya no discutís con quien no te escucha.","in_bust2"),card("2. Te cuesta menos decir que no.","met248722"),card("3. Disfrutás estar solo.","pz_moonrise"),card("4. Tus metas ya no se parecen a las de los demás.","wm_mistyforest"),fin("5. Te exigís sin castigarte.","Guardalo y compartilo con<br>quien lo necesita hoy.")],
 "5 señales de que estás creciendo","¿Cuántas ya cumplís? #mentalidad #crecimientopersonal #madurez #motivacion #parati #fyp","River Flows in You - Yiruma","lista 6"),
("43-nadie-pregunta",[card("Nadie te pregunta cuánto te costó llegar. Solo ven dónde estás.","cb_gallery"),card("Por eso el camino lo vas a recordar solo vos.","out_steps"),card("Hacelo bien aunque nadie lo sepa.","dc_peaks")],
 "Nadie pregunta cuánto te costó","Hacelo bien aunque nadie lo sepa. #mentalidad #esfuerzo #disciplina #motivacion #parati #fyp","Gymnopédie No.1 - Satie","carrusel 3 sin cierre"),
("44-lo-que-no-hiciste",[card2("No te arrepentís de lo que fallaste. Te arrepentís de lo que no intentaste.","vea_wanderer")],
 "Leelo otra vez","Intentá. Aunque salga mal. #mentalidad #arrepentimiento #valentia #reflexion #frasesmotivadoras","Hallelujah - piano","video enigma"),
("45-pregunta-tiempo",[card("Si hoy fuera tu último año, ¿seguirías haciendo lo mismo?","vea_seafret"),card("Si la respuesta es no, ya sabés qué cambiar.","am_prom"),card("No hace falta cambiar todo. Alcanza con empezar por una cosa.","pz_dahl"),fin("Elegí una hoy.","Compartilo con el que<br>necesita un cambio.")],
 "¿Seguirías haciendo lo mismo?","Elegí una cosa y empezá hoy. Contame cuál. #mentalidad #cambio #proposito #motivacion #parati #fyp","Nuvole Bianche - Einaudi","carrusel 4 pregunta"),
]
md=[]
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=[\n"+",\n".join(rows)+"\n];\n")
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas9.md","w",encoding="utf-8").write("\n".join(md)+"\n")
