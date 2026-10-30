import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("12-salvar",[card("Nadie viene a salvarte. Y eso, bien entendido, es una buena noticia.","vea_caspian"),card("Si nadie lo va a hacer por vos, entonces todo depende de vos.","eh_DP820349"),card("Dejé de esperar rescate el día que me volví mi propio plan.","am_babel"),fin("Salvate vos.","Compartilo con el que<br>espera que alguien lo rescate.")],
 "Nadie viene a salvarte","Guardalo y hacete cargo hoy #mentalidad #responsabilidad #disciplina #motivacion #parati #fyp","Beethoven's Silence","carrusel 4"),
("13-palabra",[card("La promesa que más<br>importa es la que<br>te hacés a vos.","am_b256845")],
 "Cumplile a vos mismo","Cada vez que te fallás, te creés un poco menos #mentalidad #palabra #disciplina #motivacion #parati #fyp","Time - Hans Zimmer","video"),
("14-dolor",[card("Duele la disciplina. Duele el arrepentimiento. Elegí cuál querés cargar.","mn_437191"),card("El dolor de hoy dura una hora. El arrepentimiento puede durar años.","mn_437586"),card("Lo que evitás hoy, mañana te cobra con intereses.","mn_436653")],
 "Duele la disciplina. Duele el arrepentimiento","Guardalo y elegí tu dolor #mentalidad #disciplina #arrepentimiento #motivacion #parati #fyp","Faded Glass Hours - Sean Miller","carrusel 3 sin cierre"),
("15-estandares",[card("No bajes tu estándar para que otros se sientan cómodos.","met248722")],
 "No bajes tu estándar","Guardalo antes de conformarte #mentalidad #estandares #crecimiento #motivacion #parati #fyp","Experience - Ludovico Einaudi","video"),
("16-tenes",[card("Lo que hoy tenés fue lo que soñabas hace unos años.","wm_mistyforest"),card("Mejorar no es no agradecer. Es agradecer y querer más.","pz_dahl"),card("Mirá cuánto avanzaste antes de decir que no pasa nada.","vea_titian"),fin("Mirá hasta dónde llegaste.","Compartilo con el que<br>se olvidó de lo que logró.")],
 "Lo que hoy tenés fue lo que soñabas","Guardalo para los días que sientas que no avanzás #mentalidad #gratitud #crecimiento #motivacion #parati #fyp","Emotional Cinematic - AShamaluevMusic","carrusel 4"),
("17-senales",[card("5 señales de que estás creciendo aunque no lo notes","met248142"),card("1. Ya no explicás tanto tus decisiones.","met251037"),card("2. Te cuesta menos decir que no.","am_b248118"),card("3. Lo que antes te quitaba el sueño ya no.","am_b251198"),fin("4 y 5. Preferís el silencio a la discusión y la paz al aplauso.","Guardalo y compartilo<br>con el que crece en silencio.")],
 "5 señales de que estás creciendo","Guardalo y volvé a leerlo cuando dudes #mentalidad #crecimiento #señales #motivacion #parati #fyp","Magnolia - Claudio Constantini","lista 5"),
("18-miedo-precio",[card("Cobrás poco, no porque valgas poco, sino por miedo a que te digan que no.","hb_1n"),card("Quien se vende barato por miedo termina trabajando para el que se animó.","hb_2n"),card("Subí el precio antes de sentirte listo. Así se aprende.","hb_3n"),fin("Valés más que tu miedo.","Compartilo con el que<br>cobra menos de lo que vale.")],
 "Cobrás poco por miedo","Guardalo antes de tu próxima propuesta #mentalidad #dinero #valor #emprender #parati #fyp","Cinematic Inspiring Epic","carrusel 4"),
("19-no-responder",[card("No todo merece respuesta.<br>Mi paz tampoco<br>se negocia.","mn_698749")],
 "No todo merece respuesta","Guardalo para tu próxima discusión #mentalidad #paz #madurez #motivacion #parati #fyp","Interstellar Main Theme - Hans Zimmer","video"),
]
md=[]
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=[\n"+",\n".join(rows)+"\n];\n")
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas.md","w",encoding="utf-8").write("\n".join(md)+"\n")
