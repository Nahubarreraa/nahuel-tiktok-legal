import textwrap,os
F="file:///D:/proyectos/nahuel-tiktok-legal/tools/tarjetas/fondos/"
W=lambda q,n=21:"<br>".join(textwrap.wrap(q.replace("<br>"," "),n))
A="Mentalidad de Acero"
def card(q,b): return '{q:"%s",a:"%s",bg:"%s%s.jpg"}'%(W(q),A,F,b)
def fin(q,cta): return '{q:"%s",cta:"%s",a:"%s",inv:true}'%(W(q),cta,A)
P=[
("25-cuantos-si",[card("¿A cuántas cosas dijiste que sí esta semana sin querer?","out_fog"),card("Cada sí que no sentís es un no que le das a tu tiempo.","out_peaks"),card("Dar explicaciones de más es pedir permiso para ser vos.","out_ribera"),card("Un no tranquilo hoy te ahorra un rencor largo mañana.","am_met437643"),fin("Decir que no también es cuidarte.","Compartilo con alguien<br>que no sabe decir que no.")],
 "¿Cuántos sí te debés?","Decir que no también es cuidarte. Mandáselo a quien lo necesite. #mentalidad #limites #disciplina #crecimientopersonal #frases #reflexion","Consuelo - Txmy","carrusel 5 con pregunta"),
("26-leelo-otra-vez",[card("Le dijo a su hijo «después jugamos» durante diez años. Un día el hijo dejó de pedírselo.","mn_441933")],
 "Leelo otra vez","Hay ausencias que no se ven en la agenda. #familia #reflexion #mentalidad #prioridades #frasesmotivadoras","Every Word - Ivan Castro (o piano instrumental)","video enigma"),
("27-aparentar",[card("Aparentar sale caro. Ser tranquilo sale barato.","in_bustB"),card("El auto en cuotas impresiona a gente que no te paga las cuotas.","out_athlete"),card("A los que impresionás hoy no los vas a ver el día que caés.","out_hercules"),fin("Libertad es plata que no le debés a nadie.","Compartilo con quien gasta<br>para que lo vean.")],
 "Lo que sale caro","Ahorrar en silencio también es ambición. #dinero #finanzas #mentalidad #ahorro #disciplina #frases","Runaway - Piano Rendition","carrusel 4 pregunta/lista"),
]
md=[]
for d,rows,title,desc,snd,fmt in P:
    p="posts/cola/"+d; os.makedirs(p,exist_ok=True)
    open(p+"/cards.js","w",encoding="utf-8").write("window.CARDS=[\n"+",\n".join(rows)+"\n];\n")
    md.append("| %s | `posts/cola/%s` | %s | %s | %s | %s | PENDIENTE |"%(d[:2],d,title,desc,fmt,snd))
open("posts/cola/_nuevas3.md","w",encoding="utf-8").write("\n".join(md)+"\n")
