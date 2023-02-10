import psycopg2
from flask import Flask, render_template, request

# setup environment variables
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add-name', methods=['POST'])
def add_name():
    name = request.form['name']
    connection = psycopg2.connect(os.environ.get("DATABASE_URL"))
    cursor = connection.cursor()
    cursor.execute("INSERT INTO users (name) VALUES (%s)", (name,))
    connection.commit()
    connection.close()
    return render_template('add-name-success.html', name=name)


@app.route('/names')
def names():
    connection = psycopg2.connect(os.environ.get("DATABASE_URL"))
    cursor = connection.cursor()
    cursor.execute("SELECT name from users")
    rows = cursor.fetchall()
    connection.close()
    return render_template('names.html', rows=rows)


if __name__ == '__main__':
    app.run(debug=True)
