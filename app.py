import psycopg2
import json
import datetime
from flask import Flask, jsonify, render_template, request, Response, redirect, url_for

app = Flask(__name__)


def connexion():
    # con = psycopg2.connect(database='WAE_Local',
    #                        user='postgres',
    #                        host='localhost',
    #                        password='basket',
    #                        port='5432')
                           
    con = psycopg2.connect(database='bn1io6th4a3umkgpylvg',
                           user='u4kq3mqz3af6qaixesbk',
                           host='bn1io6th4a3umkgpylvg-postgresql.services.clever-cloud.com',
                           password='YzBpVyVITZ2BIxd91LWR',
                           port='5432')
    return con

#----- Route URL -----#
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/recherche')
def recherche():
    return render_template('recherche.html')


@app.route('/addexp')
def addexp():
    return render_template('addexp.html')


@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/signin')
def signin():
    return render_template('signin.html')


@app.route('/signup')
def signup():
    return render_template('signup.html')


@app.route('/profil/<int:id>')
def profil(id):
    print(id)
    return render_template('profil.html')


#----- Requêtes HTTP -----#
@app.route('/getUser', methods=['POST'])
# Récupère un utilisateur à partir de son ID
def getUser():
    con = connexion()
    cur = con.cursor()
    id = request.form['id']
    cur.execute(
        """ SELECT * FROM "Utilisateur" WHERE "Utilisateur".ident = %s""", (id,))
    data = fetchToJson(cur.fetchall())
    return Response(json.dumps(data[0]))


@app.route('/saveUser', methods=['POST'])
# Sauvegarde un utilisateur et renvoie son ID récemment crée.
# A penser : Gérer le fait qu'un email peut être enregistré une seule fois
def saveUser():
    user = json.loads(request.form['newUser'])
    con = connexion()
    cur = con.cursor()
    cur.execute(""" SELECT "mail" FROM "Utilisateur" """, ())
    mails = cur.fetchall()
    for i in mails:
        if (i[0]==user['Email']):
            return 'False'

    if (user['DateDiplome'] == ''):
        cur.execute("""INSERT INTO "Utilisateur"("fam_name", "first_name", "surname", "diploma", "mail", "mdp", "date_diplo", "phone_number") VALUES (%s, %s, %s, %s, %s, %s, NULL, %s); """,
                (user['Nom'], user['Prenom'], user['Surnom'], user['Diplome'], user['Email'], user['Mdp'], user['Telephone']))
    else:
        cur.execute("""INSERT INTO "Utilisateur"("fam_name", "first_name", "surname", "diploma", "mail", "mdp", "date_diplo", "phone_number") VALUES (%s, %s, %s, %s, %s, %s, %s, %s); """,
                    (user['Nom'], user['Prenom'], user['Surnom'], user['Diplome'], user['Email'], user['Mdp'], user['DateDiplome'], user['Telephone']))

    con.commit()
    cur.execute(""" SELECT "ident" FROM "Utilisateur" WHERE "mail"=%s """, (user['Email'], ))
    id = cur.fetchall()
    for i in id:
        x = {
            'id': i[0]
        }
    return x


#----- Modèles -----#
def fetchToJson(users):
    liste = []
    for user in users:
        x = {
            'Id': user[0],
            'Nom': user[1],
            'Prenom': user[2],
            'Surnom': user[3],
            'Diplome': user[4],
            'Email': user[5],
            'Mdp': user[6],
            'Telephone': user[8],
        }
        if (user[7]):
            x['DateDiplome'] = user[7].isoformat()
        liste.append(x)
    return liste

if __name__ == "__main__":
    app.run(debug=True)
