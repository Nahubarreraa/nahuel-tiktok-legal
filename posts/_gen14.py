import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def card3(q,b,c): return '{q:"%s",cta:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),c,A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("72-despues-del-animo",[card("Disciplina es hacer lo que dijiste, después de que se fue el ánimo con el que lo dijiste.","mn_437191")],
 "La disciplina","Guardalo para cuando se te vaya el ánimo. Compartilo con el que empieza y abandona. #mentalidad #disciplina #constancia #motivacion #parati #fyp","Experience - Ludovico Einaudi","video disciplina sin cta"),
("73-fuerte-no-es",[card("Ser fuerte no es no sentir miedo, tristeza o cansancio.","vea_caspian"),card("Es sentirlos y hacer lo que hay que hacer igual.","dc_hercules2"),card("Los que parecen duros solo aprendieron a avanzar con eso adentro.","in_bustB"),card("Nadie nace de acero. Se forja.","am_vulcan")],
 "Ser fuerte no es no sentir","Compartilo con el que anda cargando solo. #mentalidad #fortaleza #resiliencia #disciplina #motivacion #fyp","Comptine d'un autre été - Yann Tiersen","carrusel 4 remate oscuro"),
("74-mente-para",[card3("Tu mente te pide que pares mucho antes de que tu cuerpo lo necesite.","pz_dahl","Leelo otra vez.")],
 "Leelo otra vez","Casi siempre podés un poco más. #mentalidad #disciplina #fortaleza #reflexion #frasesmotivadoras","Hallelujah - piano","video enigma"),
("75-dejan-de-hacer",[card("5 cosas que dejan de hacer los que mejoran","met248142"),card("1. Esperar el momento perfecto.","dc_steps"),card("2. Contarle a todos sus planes.","in_bust2"),card("3. Compararse con el que empezó antes.","mn_man2"),card("4. Buscar motivación en vez de armar una rutina.","out_athlete"),card("5. Esperar que salga bien para empezar.","vea_ostermorgen")],
 "5 cosas que dejan de hacer los que mejoran","Guardalo y quedate con la que más te falte. Compartilo con el que quiere mejorar. #mentalidad #crecimiento #habitos #disciplina #motivacion #fyp","Nuvole Bianche - Einaudi","lista 6 remate oscuro"),
("76-un-dia-mas",[card("Lo que separa al que lo logra del que no es un día más de aguante.","vea_seafret")],
 "Un día más","Un día más. Compartilo con el que está por rendirse. #mentalidad #constancia #resiliencia #disciplina #parati #fyp","Kiss the Rain - Yiruma","video constancia sin cta"),
]
md=[]
NL=chr(10)
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=["+NL+(","+NL).join(rows)+NL+"];"+NL)
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas14.md","w",encoding="utf-8").write(NL.join(md)+NL)
