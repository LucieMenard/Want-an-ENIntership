from flask import Flask, jsonify, render_template, request, Response

app = Flask(__name__)

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

@app.route('/profil')
def side():
    return render_template('profil.html')

if __name__=="__main__":
    app.run(debug=True)