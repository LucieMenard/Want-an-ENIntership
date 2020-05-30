import psycopg2
import json
import datetime
from flask import Flask, jsonify, render_template, request, Response, redirect, url_for, session
from pprint import pprint

app = Flask(__name__)
app.secret_key='enib'

##############################################################################
# Tables de référence
#
# Par la suite, ces données pourraient être stockées dans la base de données,
# Pour le moment on simplifie en les mettant içi
##############################################################################
def getGrade():
    return {
        "1": "★",
        "2": "★★",
        "3": "★★★",
        "4": "★★★★",
        "5": "★★★★★"
    }
    
def getQuestions():
    return {
        "q1": "Question 1",
        "q2": "Question 2",
        "q3": "Question 3",
        "q4": "Question 4",
        "q5": "Question 5"
    }

def getExperienceTypes():
    return {
        "cdi": "CDI",
        "cdd": "CDD",
        "stage": "Stage",
        "alt": "Alternance"
    }

def getExperienceDurations():
    return {
        "1m": "1 mois",
        "2m": "2 mois",
        "3m": "3 mois",
        "4m": "4 mois",
        "5m": "5 mois",
        "6m": "6 mois",
        "7m": "7 mois",
        "8m": "8 mois",
        "9m": "9 mois",
        "10m": "10 mois",
        "11m": "11 mois",
        "12m": "1 an",
        "more": "+",  
    }

def getExperienceDomains():
    return [
        {"value": "computing"    , "label": "Informatique"  },
        {"value": "mecatronic"   , "label": "Mécatronique"  },
        {"value": "electronic"   , "label": "Electronique"  }
    ]

def getAllCompanies():
    # Récupérer la connexion à la base de données
    # Récupérer tous les enregistrements de la table Entreprise dans la BDD. on veut les champs "id_entreprise" et "name"
    
    # Les mettre sous la forme attendue
    
    # On essaie de se connecter à la base et on retourne une erreur "503 - service non disponible" si ça échoue
    try:
        con = connexionDB()
    except Exception :
        return "Impossible de se connecter à la base de données", 503 # http status 503 = "Service unavailable"
    
    cur = con.cursor()
    cur.execute(""" SELECT id_entreprise,name,country FROM "Entreprise" """)
    data = cur.fetchall()
    
    return data
def getInfosCompanies():
    try:
        con = connexionDB()
    except Exception :
        return "Impossible de se connecter à la base de données", 503 # http status 503 = "Service unavailable"
    
    cur = con.cursor()
    cur.execute(""" SELECT id_entreprise,name,city,country FROM "Entreprise" """)
    data = cur.fetchall()
    
    return data

def connexionDB():
    #BDD test Lucie local
    con = psycopg2.connect(database='WAE test local',
                           user='postgres',
                           host='localhost',
                           password='luciemenard',
                           port='5432')
    ## BDD de test 
    # con = psycopg2.connect(database='bjiw069frhijwtxapwih',
    #                        user='uo3wdoc8qcwuds1kkfoq',
    #                        host='bjiw069frhijwtxapwih-postgresql.services.clever-cloud.com',
    #                        password='SvJ4jdq7w3n7dMHiO2t6',
    #                        port='5432')

    ## BDD WAE        
    # con = psycopg2.connect(database='bn1io6th4a3umkgpylvg',
    #                        user='u4kq3mqz3af6qaixesbk',
    #                        host='bn1io6th4a3umkgpylvg-postgresql.services.clever-cloud.com',
    #                        password='YzBpVyVITZ2BIxd91LWR',
    #                        port='5432')
                           
    
    return con

def getCurrentUser():
    #Renvoie l'id de l'user s'il y a un user dans la session sinon renvoie 0
    return session['user'] if 'user' in session else 0

########################
#      Routes URL      #
########################
@app.route('/')
def index():
    return render_template(
        'index.html',
        id = getCurrentUser()
    )

@app.route('/recherche')
def recherche():
    return render_template(
        'recherche.html',
        id = getCurrentUser()
    )

@app.route('/searchEntreprise')
def searchEntreprise():
    return render_template(
        'searchEntreprise.html',
        infoCompanies=getInfosCompanies(),
        id = getCurrentUser()
    )

@app.route('/addexp')
def addexp():
    if 'user' not in session : 
        return redirect(url_for('signin'))
     
    return render_template(
        'addexp.html', 
        types=getExperienceTypes(),
        domains=getExperienceDomains(),
        durations=getExperienceDurations(),
        companies=getAllCompanies(),
        grades=getGrade(),
        questions=getQuestions(),
        id = getCurrentUser()
    )

@app.route('/contact')
def contact():
    return render_template('contact.html')


@app.route('/signin')
def signin():
    return render_template(
        'signin.html',
        id=getCurrentUser()
    )

@app.route('/signup')
def signup():
    return render_template(
        'signup.html',
        id=getCurrentUser()
    )

@app.route('/profil/<int:id>')
def profil(id):
    if session['user']==id:
        #print(id)
        return render_template('profil.html',id=getCurrentUser())
    else:
        return redirect(url_for('profil', id=getCurrentUser()))

########################
#    Requêtes HTTP     #
########################

#----- Utilisateur -----#

@app.route('/getUser', methods=['POST'])
# Récupère un utilisateur à partir de son ID
def getUser():
    con = connexionDB()
    cur = con.cursor()
    id = request.form['id']
    cur.execute(
        """ SELECT * FROM "Utilisateur" WHERE "Utilisateur".ident = %s""", (id,))
    data = fetchToJson(cur.fetchall())
    con.close()
    return Response(json.dumps(data[0]))


@app.route('/saveUser', methods=['POST'])
# Sauvegarde un utilisateur et renvoie son ID récemment crée.
def saveUser():
    user = json.loads(request.form['newUser'])
    con = connexionDB()
    cur = con.cursor()
    cur.execute(""" SELECT COUNT(*) FROM "Utilisateur" WHERE "mail"=%s """, (user['Email'], ))
    test = cur.fetchone()[0]
    if (test>0):
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
    session['user']=x['id'] # x['id'] = a :)
    con.close()
    return x

@app.route('/modifUser', methods=['POST'])
def modifUser():
    con = connexionDB()
    cur = con.cursor()
    user = json.loads(request.form['newUser'])
    if user['Diplome']:
        cur.execute("""UPDATE "Utilisateur" SET "surname"=%s, "diploma"=%s, "mdp"=%s, "date_diplo"=%s, "phone_number"=%s WHERE "ident" = %s""", (user['Surnom'], user['Diplome'], user['Mdp'], user['DateDiplome'], user['Telephone'], session['user']))
    else:
        cur.execute("""UPDATE "Utilisateur" SET "surname"=%s, "diploma"=%s, "mdp"=%s, "date_diplo"=NULL, "phone_number"=%s WHERE "ident" = %s""", (user['Surnom'], user['Diplome'], user['Mdp'], user['Telephone'], session['user']))
    con.commit()
    return 'True'


@app.route('/tryPassword', methods=['POST'])
def tryPassword():
    con = connexionDB()
    cur = con.cursor()
    cur.execute("""SELECT "mdp" FROM "Utilisateur" WHERE "ident"=%s """, (session['user'],))
    userPassword = cur.fetchone()[0]
    receivedPassword = request.form['mdp']
    if (receivedPassword==userPassword):
        return 'True'
    else:
        return 'False'
    
#----- Experiences -----#
#----- Add Exp -----#
@app.route('/getExp/<id>', methods=['GET'])
# Récupère une expérience à partir de son ID
def getExp(id):
    # TODO généraliser les tests aux autres fonctions
    # Connexion à la base de données
    try :
        con = connexionDB()
    except Exception as e :
        # Renvoie d'une erreur 503 si la tentative de connexion
        return "Impossible de se connecter à la BDD", 503 # HTTP status 503 = "Service unavailable"

    # Récupère l'expérience depuis la BDD
    try :
        cur = con.cursor()
        cur.execute(""" SELECT * FROM "Experience" WHERE ident_exp = %s""", (id,))
    except Exception as e :
        return "Experience non trouvé : \n" + str(e), 503 # TODO : trouver le code erreur HTTP qui convient à la place du 503
    
    exp = cur.fetchone()
    pprint(exp)
    return "Affichage exp " + id
    # data = fetchToJson(cur.fetchall())
    # return Response(json.dumps(data[0]))

@app.route('/saveExp', methods=['POST'])
# Sauvegarde une expérience et renvoie son ID récemment crée.
def saveExp():
    # Vérification de la session
    if 'user' not in session : 
        return "Accès interdit !", 401 # HTTP status 401 = "Authentification necessaire"

    # Connexion à la base de données
    try :
        con = connexionDB()
    except Exception as e :
        #Renvoie d'une erreur 503 si la tentative de connexion
        return "Impossible de se connecter à la BDD", 503 # HTTP status 503 = "Service unavailable"

    # Recupération des données de contact saisies dans le formulaire
    contact = json.loads(request.form['newContact'])

    # Recupération des données d'expérience saisies dans le formulaire
    exp = json.loads(request.form['newExp'])
    #return request.form['newExp'],503
    # Valide les données transmises, génère une erreur si tout n'est pas ok (-> TODO)
    # if !validate(exp):
    #    return "données incorrectes", 400

    #Enregistrement des données du contact dans la table Contact de la BDD
    try :
        #Création du curseur pour faire les requetes SQL
        cur = con.cursor()
        cur.execute("""INSERT INTO "Contact"("last_Name","first_Name","phone_number", "mail_Contact", "enibien") VALUES (%s, %s, %s, %s, %s); """,
                                                 (contact['Nom'], contact['Prenom'], contact['Telephone'], contact['Email'], contact['Enibien']))
        con.commit()
    except Exception as e :
        return "Impossible d'enregistrer le contact : \n" + str(e), 503 # TODO : trouver le code erreur HTTP qui convient à la place du 503

    #Récupération de l'ID du contact lié à l'entreprise
    cur.execute('SELECT LASTVAL()')
    idContact = cur.fetchone()[0]

    #Récupération de l'ID de l'utilisateur
    ident = session['user']

    # Calcul de la note du stage donné par l'user
    
    # temp = int(exp['Grade']['q1'])
    # grade= (temp*100/5 ) * 20
    # print("grade =",grade)

    #Enregistrement des données dans la table Experience de la BDD 
    try :
        #Création du curseur pour faire les requetes SQL
        cur = con.cursor()
        cur.execute("""INSERT INTO "Experience"("ident","env_grade","type", "domain", "start_date", "end_date", "money", "feel_grade", "duration", "contact", "company", "description") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s); """,
                                                 (ident,1,exp['Type'], exp['Domain'], exp['StartDate'],exp['EndDate'], exp['Money'], exp['FeelGrade'], exp['Duration'], idContact, exp['Company'], exp['Description']))
        con.commit()
    except Exception as e :
        return "Impossible d'enregistrer l'expérience : \n" + str(e), 503 # TODO : trouver le code erreur HTTP qui convient à la place du 503

    #Récupération de l'ID
    cur.execute('SELECT LASTVAL()')
    id = cur.fetchone()[0]

    #Retourne une réponse JSON 200 (=OK) contenant l'ID
    return {'id':id, 'url':url_for('getExp', id=id)}

#-- Contact --#
@app.route('/getContact', methods=['POST'])
# Récupère un contact à partir de son ID
def getContact():
    con = connexionDB()
    cur = con.cursor()
    id = request.form['newExp']
    cur.execute(""" SELECT * FROM "Contact" WHERE "Contact".ident = %s""", (id,))
    data = fetchToJson(cur.fetchall())
    con.close()
    return Response(json.dumps(data[0]))


@app.route('/saveContact', methods=['POST'])
# Sauvegarde un contact
def saveContact():
    contact = json.loads(request.form['newContact'])
    pprint(contact)
    con = connexionDB()
    cur = con.cursor()
    cur.execute("""INSERT INTO "Contact"("last_Name", "first_Name", "phone_number", "mail_Contact", "enibien") VALUES (%s, %s, %s, %s, %s) RETURNING "ident"; """,
                (contact['Nom'], contact['Prenom'], contact['Telephone'], contact['Email'], contact['Enibien']))
    a = cur.fetchone()[0]
    con.commit()
    x = {
       'id': a
    }
    return x   

#-- Entreprise --#
@app.route('/saveEntreprise', methods=['POST'])
def saveEntreprise():
    entreprise = json.loads(request.form['newEntreprise'])
    con = connexionDB()
    cur = con.cursor()
    cur.execute("""SELECT COUNT(*) FROM "Entreprise" WHERE "name"=%s""", (entreprise['Name'],))
    test = cur.fetchone()[0]
    if (test>0):
        return 'False'
    cur.execute("""INSERT INTO "Entreprise"("name", "address", "postal_code", "city", "country", "grade") VALUES (%s,%s,%s,%s,%s,%s) RETURNING "id_entreprise";""",
                (entreprise['Name'],entreprise['Address'],entreprise['Postal_Code'],entreprise['City'],entreprise['Country'],0))
    a = cur.fetchone()[0]
    con.commit()
    return {
       'id': a,
       'name': entreprise['Name'],
       'country': entreprise['Country']
    }
    

#----- Connexion -----#

@app.route('/connexion', methods=['POST'])
def connexion():
    email = request.form['email']
    mdp = request.form['mdp']
    recup = connexionSQL(email)
    if recup==False :
        return 'Email'
    else :
        if mdp==recup['mdp']:
            session['user'] = recup['id']
            return recup
        else :
            return 'Mdp'

#----- Deconnexion -----#

@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('index'))




########################
#      DB Request      #
########################

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


########################
#      DB Request      #
########################

def connexionSQL(mail):
    con = connexionDB()
    cur = con.cursor()
    cur.execute(""" SELECT "ident", "mail", "mdp" FROM "Utilisateur" WHERE "mail"=%s """, (mail,))
    a = cur.fetchone()
    if (a):
        x = {
            'id': a[0],
            'mail': a[1],
            'mdp': a[2]
        }
        return x
    else :
        return False

if __name__ == "__main__":
    app.run(debug=True)
