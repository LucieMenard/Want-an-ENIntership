import psycopg2
import json
import datetime
from flask import Flask, jsonify, render_template, request, Response, redirect, url_for, session

app = Flask(__name__)
app.secret_key='enib'

def connexionDB():
    con = psycopg2.connect(database='WAE',
                           user='postgres',
                           host='localhost',
                           password='basket',
                           port='5432')
                           
    # con = psycopg2.connect(database='bn1io6th4a3umkgpylvg',
    #                        user='u4kq3mqz3af6qaixesbk',
    #                        host='bn1io6th4a3umkgpylvg-postgresql.services.clever-cloud.com',
    #                        password='YzBpVyVITZ2BIxd91LWR',
    #                        port='5432')
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

@app.route('/testConn')
def testConn():
    if 'user' in session:
        return redirect(url_for('profil', id=session['user']))
    else:
        return redirect(url_for('signin'))



#----- Requêtes HTTP -----#
#-- Sign in --#
@app.route('/getUser', methods=['POST'])
# Récupère un utilisateur à partir de son ID
def getUser():
    con = connexionDB()
    cur = con.cursor()
    id = request.form['id']
    cur.execute(
        """ SELECT * FROM "Utilisateur" WHERE "Utilisateur".ident = %s""", (id,))
    data = fetchToJson(cur.fetchall())
    return Response(json.dumps(data[0]))


@app.route('/saveUser', methods=['POST'])
# Sauvegarde un utilisateur et renvoie son ID récemment crée.
def saveUser():
    user = json.loads(request.form['newUser'])
    con = connexionDB()
    cur = con.cursor()
    cur.execute(""" SELECT "mail" FROM "Utilisateur" """, ())
    mails = cur.fetchall()
    for i in mails:
        if (i[0]==user['Email']):
            return 'False'

    if (user['DateDiplome'] == ''):
        cur.execute("""INSERT INTO "Utilisateur"("fam_name", "first_name", "surname", "diploma", "mail", "mdp", "date_diplo", "phone_number") VALUES (%s, %s, %s, %s, %s, %s, NULL, %s) RETURNING "ident"; """,
                (user['Nom'], user['Prenom'], user['Surnom'], user['Diplome'], user['Email'], user['Mdp'], user['Telephone']))
    else:
        cur.execute("""INSERT INTO "Utilisateur"("fam_name", "first_name", "surname", "diploma", "mail", "mdp", "date_diplo", "phone_number") VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING "ident"; """,
                    (user['Nom'], user['Prenom'], user['Surnom'], user['Diplome'], user['Email'], user['Mdp'], user['DateDiplome'], user['Telephone']))

    a = cur.fetchone()[0]
    con.commit()
    x = {
        'id': a
    }
    return x

#-- Add Exp --#
@app.route('/getExp', methods=['POST'])
# Récupère une expérience à partir de son ID
def getExp():
    con = connexionDB()
    cur = con.cursor()
    id = request.form['id']
    cur.execute(""" SELECT * FROM "Experience" WHERE "Experience".ident = %s""", (id,))
    data = fetchToJson(cur.fetchall())
    return Response(json.dumps(data[0]))


@app.route('/saveExp', methods=['POST'])
# Sauvegarde une expérience et renvoie son ID récemment crée.
# ! Faire le renvoie id
def saveExp():
    exp = json.loads(request.form['newExp'])
    con = connexionDB()
    cur = con.cursor()
    idContact = getContact()
    cur.execute("""INSERT INTO "Experience"("type", "domain", "start_date", "end_date", "money", "feel_grade", "duration", "contact", "company", "description") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s); """,
                (exp['Type'], exp['Domain'], exp['StartDate'], exp['EndDate'], exp['Money'], exp['FeelGrade'], exp['Duration'], idContact, exp['Company'], exp['Description']))
    con.commit()

@app.route('/saveEntreprise', methods=['POST'])
def saveEntreprise():
    entreprise = json.loads(request.form['newEntreprise'])
    con = connexionDB()
    cur = con.cursor()
    cur.execute("""INSERT INTO "Entreprise"("name", "address", "postal_code", "city", "country", "grade") VALUES (%s,%s,%s,%s,%s,%s) RETURNING "id_entreprise";""",
                (entreprise['Name'],entreprise['Address'],entreprise['Postal_Code'],entreprise['City'],entreprise['Country'],0))
    #a = cur.fetchone()[0]
    con.commit()
    #x = {
    #    'id': a
    #}
    #return x
    

#-- Contact --#
@app.route('/getContact', methods=['POST'])
# Récupère un contact à partir de son ID
def getContact():
    con = connexionDB()
    cur = con.cursor()
    id = request.form['id']
    cur.execute(""" SELECT * FROM "Contact" WHERE "Contact".ident = %s""", (id,))
    data = fetchToJson(cur.fetchall())
    return Response(json.dumps(data[0]))


# @app.route('/saveContact', methods=['POST'])
# # Sauvegarde un contact
# # ! Faire le renvoie id pour le réutiliser avec l'expérience
# def saveContact():
#     contact = json.loads(request.form['newContact'])
#     con = connexionDB()
#     cur = con.cursor()
#     cur.execute("""INSERT INTO "Contact"("last_Name", "first_Name", "phone_number", "mail_Contact", "enibien") VALUES (%s, %s, %s, %s, %s); """, (contact['Nom'], contact['Prenom'], contact['Telephone'], contact['Email'], contact['Enibien']))
#     con.commit()

@app.route('/connexion', methods=['POST'])
def connexion():
    email = request.form['email']
    mdp = request.form['mdp']
    recup = connexionSQL(email)
    if mdp==recup['mdp']:
        session['user'] = recup['id']
        return recup
    else :
        print('no')

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

#----- DB Request -----#
def connexionSQL(mail):
    con = connexionDB()
    cur = con.cursor()
    cur.execute(""" SELECT "ident", "mail", "mdp" FROM "Utilisateur" WHERE "mail"=%s """, (mail,))
    a = cur.fetchone()
    x = {
        'id': a[0],
        'mail': a[1],
        'mdp': a[2]
    }
    return x

if __name__ == "__main__":
    app.run(debug=True)
