import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("20-paz-lista",[card("4 cosas que dejé de hacer para vivir más tranquilo","in_bustA"),card("1. Dejé de contestar todo lo que me provoca.","in_bustC"),card("2. Dejé de explicar mis decisiones a quien no las pidió.","met252470"),card("3. Dejé de compararme con vidas editadas.","am_b255903"),fin("4. Dejé de esperar aprobación.","Guardalo y compartilo con<br>el que necesita más paz.")],
 "4 cosas que dejé de hacer para vivir tranquilo","Guardalo y quedate con la que más te sirva #mentalidad #paz #madurez #motivacion #parati #fyp","Clair de Lune - Debussy","lista 5"),
("21-orgullo",[card("Tu yo de hace un año te está mirando. Dale una razón para estar orgulloso.","ga_student")],
 "Tu yo de hace un año te está mirando","Dale una razón para estar orgulloso #mentalidad #crecimiento #superacion #motivacion #parati #fyp","River Flows in You - Yiruma","video"),
("22-pequeno",[card("Cómo hacés lo pequeño es cómo hacés todo.","ac_emmaus"),card("Una cama hecha, un mensaje respondido, un vaso de agua: así empieza la disciplina.","ac_walkers"),card("Quien no cumple lo chico no cumple lo grande. Empezá por lo que tenés a mano.","am_met437190"),fin("Ordená lo chico.","Compartilo con el que quiere<br>cambiar todo de golpe.")],
 "Cómo hacés lo pequeño es cómo hacés todo","Guardalo y empezá por lo chico #mentalidad #disciplina #habitos #motivacion #parati #fyp","Cornfield Chase - Hans Zimmer","carrusel 4"),
("23-excusa",[card("El que quiere encuentra la forma. El que no, encuentra la excusa.","in_bust2")],
 "El que quiere encuentra la forma","Guardalo para cuando quieras poner excusas #mentalidad #excusas #disciplina #motivacion #parati #fyp","Gymnopedie No. 1 - Satie","video"),
("24-razon",[card("Madurar es dejar de necesitar tener razón.","wm_world"),card("Hablá menos. Escuchá más. Lo que te dicen vale más que lo que decís.","pz_whistler"),card("La calma también es poder: el que se enoja primero suele perder.","in_bust1"),fin("Ganá en silencio.","Mandáselo a quien discute<br>solo por tener razón.")],
 "Madurar es dejar de necesitar tener razón","Guardalo antes de tu próxima discusión #mentalidad #madurez #calma #motivacion #parati #fyp","Nuvole Bianche - Einaudi","carrusel 4"),
]
md=[]
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=[\n"+",\n".join(rows)+"\n];\n")
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas5.md","w",encoding="utf-8").write("\n".join(md)+"\n")
