from flask import Flask
from markupsafe import escape
from flask import render_template, abort, redirect, url_for
from recommend import make_matrix_correlation, getSong, setPrevSong
import random
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return render_template("index.html")


@app.route('/recommend/<mood>')
def show_user_profile(mood):
    x = getSong(mood)
    song_list =  make_matrix_correlation(x)
    setPrevSong(mood, song_list[random.randint(1, 9)])
    return song_list

@app.errorhandler(404)
def not_found(error):
    abort(404)

if __name__ == '__main__':
    app.run(debug=True)