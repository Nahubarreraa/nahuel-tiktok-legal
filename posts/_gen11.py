import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def card3(q,b,c): return '{q:"%s",cta:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),c,A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("52-cobrar-barato",[card3("Cobrar barato no te hace buena persona. Te hace fácil de reemplazar.","cb_money","Compartilo con el que<br>no se anima a cobrar.")],
 "Cobrar barato","Tu precio también dice cuánto te valorás. #dinero #mentalidad #valor #emprender #parati #fyp","Magnolia - Claudio Constantini","video dinero cta compartilo"),
("53-trabajar-valer",[card3("El que más trabajaba nunca fue el que más ganaba. El que más valía, sí.","av_forge","Leelo otra vez.")],
 "Leelo otra vez","Trabajar duro no es lo mismo que valer más. #dinero #mentalidad #valor #trabajo #frasesmotivadoras","Hallelujah - piano","video enigma dinero"),
("54-estoico-hoy",[card3("No controlás lo que pasa. Controlás lo que hacés después.","es_seneca","Compartilo con el que<br>anda pasándola mal.")],
 "Mensaje estoico para hoy","No controlás lo que pasa. Controlás lo que hacés después. #estoicismo #mentalidad #resiliencia #disciplina #parati #fyp","Experience - Ludovico Einaudi","video estoico cta compartilo"),
("55-incomodarse",[card3("Todos quieren cambiar. Pocos quieren incomodarse.","dc_hercules2","Leelo otra vez.")],
 "Leelo otra vez","El cambio empieza donde termina la comodidad. #mentalidad #disciplina #cambio #motivacion #frasesmotivadoras","Comptine d'un autre été - Yann Tiersen","video enigma"),
("56-quien-gana",[card("¿Por qué los que más ganan casi no hablan de plata?","md_goldweigher"),card("Porque lo que importa no es cuánto entra. Es cuánto se queda.","vl_goldsmith"),card("El que gasta para que lo vean no se ve a sí mismo.","av_gold"),fin("Pagarte a vos primero no es egoísmo.","Compartilo con el que llega<br>justo a fin de mes.")],
 "¿Por qué los que más ganan callan?","Pagarte a vos primero no es egoísmo. Compartilo con el que llega justo a fin de mes. #dinero #finanzas #mentalidad #ahorro #disciplina #fyp","Magnolia - Claudio Constantini","carrusel 4 pregunta portada dinero"),
("57-terminar-dia",[card("No es el día el que pesa. Es lo que cargás de ayer y de mañana.","pe_hammershoi"),card("Lo que ya pasó no se negocia. Lo que viene todavía no existe.","vea_seafret"),card("Hoy solo tenés que hacer bien lo de hoy.","out_fog"),fin("Descansá. Mañana se empieza de nuevo.","Compartilo con el que<br>hoy no pudo más.")],
 "Reflexión estoica para terminar el día","Compartilo con el que hoy no pudo más. #estoicismo #mentalidad #resiliencia #reflexion #parati #fyp","Kiss the Rain - Yiruma","carrusel 4 estoico"),
]
md=[]
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=[\n"+",\n".join(rows)+"\n];\n")
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas11.md","w",encoding="utf-8").write("\n".join(md)+"\n")
