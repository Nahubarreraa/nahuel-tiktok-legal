import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("28-primera-vez",[card("¿Cuándo fue la última vez que hiciste algo por primera vez?","vea_caspian"),card("Lo nuevo da miedo porque te obliga a ser principiante.","pz_dahl"),card("Quien evita sentirse torpe evita crecer.","wm_mistyforest"),card("Tu mejor versión empieza donde termina tu rutina cómoda.","dc_fog"),fin("Hacé algo por primera vez.","Compartilo con el que<br>vive en piloto automático.")],
 "¿Cuándo fue la última vez?","¿Qué cosa nueva vas a intentar esta semana? Contámelo. #mentalidad #crecimiento #zonadeconfort #motivacion #parati #fyp","Kiss the Rain - Yiruma","carrusel 5 pregunta"),
("29-ahorro-salud",[card("Ahorró toda su vida para descansar. Cuando llegó el día, ya no tenía salud para hacerlo.<br>Leelo otra vez.","mn_436485")],
 "Leelo otra vez","Hay cosas que no se pueden postergar. #reflexion #salud #mentalidad #prioridades #frasesmotivadoras","Mad World - Gary Jules (piano)","video enigma"),
("30-buenas-razones",[card("Conocí a un hombre que nunca empezó. Siempre tenía una buena razón.","gq_a_rembrandt"),card("Cuarenta años después, las razones seguían. Los sueños no.","out_steps"),card("No te compres razones. Salen más caras que el esfuerzo.","dc_peaks"),fin("Empezá con miedo.","Compartilo con el que<br>tiene muy buenas razones.")],
 "Siempre tenía una buena razón","Las razones salen más caras que el esfuerzo. #mentalidad #disciplina #postergar #motivacion #parati #fyp","Una Mattina - Einaudi","carrusel 4 caso"),
("31-no-se-rinden",[card("4 cosas que hacen distinto los que no se rinden","met251037"),card("1. Vuelven a empezar sin hacer drama.","am_b251198"),card("2. Se comparan con su ayer, no con tu feed.","in_bust2"),card("3. Se rodean de quienes les exigen.","met248142"),fin("4. Hacen el trabajo sin ganas.","Guardalo y compartilo con<br>el que está por rendirse.")],
 "4 cosas que hacen los que no se rinden","¿Cuál te falta a vos? #mentalidad #constancia #resiliencia #motivacion #parati #fyp","Now We Are Free - Hans Zimmer","lista 5"),
("32-se-lo-dijo",[card("Nadie le dijo que era capaz. Se lo dijo él mismo cada día, hasta creérselo.<br>Leelo otra vez.","gq_a_ribera")],
 "Leelo otra vez","Lo que te repetís cada día termina siendo verdad. #mentalidad #confianza #reflexion #motivacion #frasesmotivadoras","Hallelujah - piano instrumental","video enigma"),
("33-exito-soledad",[card("El éxito se parece mucho a la soledad al principio.","pz_whistler"),card("Los que aplauden llegan después de que ya ganaste.","vea_ostermorgen"),card("Construí aunque nadie mire.","out_ribera")],
 "El éxito al principio se parece a la soledad","Guardalo para los días en que nadie mira #mentalidad #exito #disciplina #motivacion #parati #fyp","Snowfall - Oneheart","carrusel 3 sin cierre"),
]
md=[]
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=[\n"+",\n".join(rows)+"\n];\n")
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas6.md","w",encoding="utf-8").write("\n".join(md)+"\n")
