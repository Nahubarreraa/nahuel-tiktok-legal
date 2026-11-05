import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def card3(q,b,c): return '{q:"%s",cta:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),c,A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("68-valientes",[card3("Nadie nace valiente. Se vuelven valientes los que hicieron lo que temían, temblando.","in_mount","Compartilo con el que<br>tiene miedo de empezar.")],
 "Nadie nace valiente","Hacelo con miedo. Hacelo igual. #mentalidad #valentia #miedo #disciplina #parati #fyp","Experience - Ludovico Einaudi","video miedo"),
("69-levantarse",[card("Nadie te mira cuando te caés. Todos te miran cuando te levantás.","vea_wanderer"),card("La caída no te define. Cuánto tardás en pararte, sí.","pz_moonrise"),card("Pararte hoy, aunque duela, te separa de la mayoría.","dc_athlete"),fin("Levantate.","Compartilo con el que<br>hoy se cayó.")],
 "Nadie te mira cuando te caés","Guardalo para el día que te caigas. Compartilo con el que hoy se cayó. #mentalidad #resiliencia #disciplina #motivacion #parati #fyp","Kiss the Rain - Yiruma","carrusel 4 levantarse"),
("70-se-alejan",[card3("Los que se alejan cuando mejorás nunca estuvieron de tu lado.","gq_a_ribera","Leelo otra vez.")],
 "Leelo otra vez","El que avanza muchas veces avanza solo. #mentalidad #crecimiento #soledad #disciplina #frasesmotivadoras","Hallelujah - piano","video enigma soledad"),
("71-dolor-ensena",[card("4 cosas que solo te enseña el dolor","met437406"),card("1. Cuánto aguantás de verdad.","mn_man2"),card("2. Quién está a tu lado cuando no hay nada que ganar.","pp_bust1"),card("3. Qué importaba y qué era ruido.","in_bust2"),fin("4. Que sos más fuerte de lo que creías.","Guardalo para tu próximo<br>mal día.")],
 "4 cosas que solo te enseña el dolor","Guardalo para tu próximo mal día. #mentalidad #resiliencia #dolor #fortaleza #motivacion #fyp","River Flows in You - Yiruma","lista 5"),
]
md=[]
NL=chr(10)
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=["+NL+(","+NL).join(rows)+NL+"];"+NL)
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas13.md","w",encoding="utf-8").write(NL.join(md)+NL)
