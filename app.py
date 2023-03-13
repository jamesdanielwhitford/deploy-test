import psycopg2
from flask import Flask, render_template, request
# from flask_session import Session;
from flask import session
from flask import jsonify
from datetime import date


# setup environment variables
import os

# Development
# from dotenv import load_dotenv
# load_dotenv()


app = Flask(__name__)

# Session(app)

@app.route('/')
def index():
    return render_template('hardle.html')

@app.route('/randle')
def randle():
    return render_template('randle.html')



# @app.route('/add-name', methods=['POST'])
# def add_name():
#     name = request.form['name']
#     connection = psycopg2.connect(os.environ.get("DATABASE_URL"))
#     cursor = connection.cursor()
#     cursor.execute("INSERT INTO users (name) VALUES (%s)", (name,))
#     connection.commit()
#     connection.close()
#     return render_template('add-name-success.html', name=name)

# @app.route('/delete-name', methods=['POST'])
# def delete_name():
#     name = request.form['name']
#     connection = psycopg2.connect(os.environ.get("DATABASE_URL"))
#     cursor = connection.cursor()
#     cursor.execute("DELETE FROM users WHERE name = %s", (name,))
#     connection.commit()
#     connection.close()
#     return render_template('add-name-success.html', name=name)

# @app.route('/names')
# def names():
#     connection = psycopg2.connect(os.environ.get("DATABASE_URL"))
#     cursor = connection.cursor()
#     cursor.execute("SELECT name from users")
#     rows = cursor.fetchall()
#     connection.close()
#     return render_template('names.html', rows=rows)


if __name__ == '__main__':
    app.run(debug=True)
