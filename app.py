from flask import Flask, jsonify, render_template, request, Response

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/signin')
def signin():
    return render_template('signin.html')

@app.route('/side')
def side():
    return render_template('sidebar-left.html')

if __name__=="__main__":
    app.run(debug=True)