import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def card3(q,b,c): return '{q:"%s",cta:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),c,A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("58-sueldo",[card("Tu sueldo no es lo que valés. Es lo mínimo que cuesta que no te vayas.","cb_gallery"),card("Mientras tu único ingreso sea tu jefe, tu jefe es tu dueño.","av_forge"),card("Aprendé algo que alguien te pague fuera de tu horario.","vl_lutma"),fin("Tu valor se construye afuera.","Compartilo con el que cobra lo<br>mismo hace tres años.")],
 "Tu sueldo no es lo que valés","Tu valor no se negocia en la oficina. Se construye afuera. Compartilo con el que cobra lo mismo hace tres años. #dinero #mentalidad #valor #trabajo #emprender #fyp","Magnolia - Claudio Constantini","carrusel 4 dinero"),
("59-hora",[card3("Quien no sabe cuánto vale su hora, termina regalándola.","lb_miser","Compartilo con el que<br>trabaja de más gratis.")],
 "Cuánto vale tu hora","Calculá cuánto vale tu hora. #dinero #mentalidad #valor #trabajo #parati #fyp","Magnolia - Claudio Constantini","video dinero cta compartilo"),
("60-te-critican",[card("Cuando empezás a cambiar, lo primero que se incomoda es tu círculo.","mn_man1"),card("No critican lo que hacés. Les molesta lo que ellos no se animan a hacer.","in_bustA"),card("Que no te entiendan no significa que estés mal.","wm_world"),fin("Seguí.","Compartilo con el que cambió<br>y nadie lo apoya.")],
 "Cuando cambiás, se incomodan","Los que más critican suelen ser los que menos intentaron. Compartilo con el que cambió y nadie lo apoya. #mentalidad #disciplina #crecimiento #motivacion #parati #fyp","Experience - Ludovico Einaudi","carrusel 4 social"),
("61-este-es-ese-ano",[card3("Hace un año dijiste: el año que viene empiezo. Este es ese año.","t_clock","Compartilo con el que<br>lo sigue postergando.")],
 "Este es ese año","Hace un año dijiste: el año que viene empiezo. #mentalidad #disciplina #postergar #motivacion #parati #fyp","Comptine d'un autre été - Yann Tiersen","video"),
("62-volver-a-empezar",[card("Volver a empezar no es volver a cero.","dc_athlete"),card("Cero es no haber aprendido nada. Vos ya sabés lo que no funciona.","am_vulcan"),card("Cada intento fallido te saca una opción equivocada del camino.","pz_whistler"),fin("Empezá de nuevo, pero desde uno.","Compartilo con el que<br>acaba de fracasar.")],
 "Volver a empezar no es volver a cero","Guardalo para cuando quieras abandonar. Compartilo con el que acaba de fracasar. #mentalidad #resiliencia #fracaso #disciplina #motivacion #fyp","Nuvole Bianche - Einaudi","carrusel 4 winner angle"),
("63-calma",[card3("Nadie puede quitarte la calma si vos no se la entregás.","vea_ostermorgen","Compartilo con el que<br>anda estresado.")],
 "Mensaje estoico para hoy","Nadie puede quitarte la calma si vos no se la entregás. #estoicismo #mentalidad #calma #resiliencia #parati #fyp","Gymnopédie No.1 - Satie","video estoico"),
("64-no-llega-fin-de-mes",[card("3 cosas que hace el que nunca llega a fin de mes","lb_boyers"),card("1. Gasta para sentirse mejor, no para estar mejor.","qe_bol"),card("2. Compra cosas que pierden valor apenas las usa.","am_smith"),card("3. No sabe cuánto gasta por mes.","av_gold"),fin("Anotá todo durante 30 días.","Compartilo con el que no<br>llega a fin de mes.")],
 "3 cosas que hace el que no llega a fin de mes","Anotá todo durante 30 días. #dinero #finanzas #ahorro #mentalidad #disciplina #fyp","Magnolia - Claudio Constantini","lista dinero 5"),
("65-celular",[card3("No te falta tiempo. Te sobra celular.","mn_436653","Compartilo con el que<br>dice que no tiene tiempo.")],
 "No te falta tiempo","No te falta tiempo. Te sobra celular. #disciplina #mentalidad #tiempo #enfoque #parati #fyp","Hallelujah - piano","video disciplina"),
("66-empezaron-antes",[card("Mientras pensabas si ibas a empezar, alguien ya empezó.","vea_mountain"),card("No es talento. Hace dos años que hace lo que vos postergás.","dc_steps"),card("En dos años vas a querer haber empezado hoy.","out_athlete"),fin("Empezá hoy.","Compartilo con el que<br>sigue pensándolo.")],
 "No es talento, empezaron antes","Los que llegan primero no corrieron más. Empezaron antes. #mentalidad #disciplina #constancia #motivacion #parati #fyp","River Flows in You - Yiruma","carrusel 4"),
("67-cuenta",[card3("El que no prospera cuenta cuánto gana. El que prospera cuenta cuánto le queda.","vl_delacroix","Leelo otra vez.")],
 "Leelo otra vez","No es cuánto ganás. Es cuánto te queda. #dinero #mentalidad #ahorro #finanzas #frasesmotivadoras","Magnolia - Claudio Constantini","video enigma dinero"),
]
md=[]
NL=chr(10)
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=["+NL+(","+NL).join(rows)+NL+"];"+NL)
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas12.md","w",encoding="utf-8").write(NL.join(md)+NL)
