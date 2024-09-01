import os
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

# Get the current version from an environment variable or a file
VERSION = os.environ.get('APP_VERSION', '1.0.1')

@app.after_request
def add_header(response):
    # Prevent caching for HTML files
    if response.content_type.startswith('text/html'):
        response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
    return response

@app.route('/')
def index():
    return render_template('hardle.html', version=VERSION)

@app.route('/randle')
def randle():
    return render_template('randle.html', version=VERSION)

@app.route('/static/<path:filename>')
def serve_static(filename):
    response = send_from_directory('static', filename)
    # Set cache control for static assets (1 year)
    response.headers['Cache-Control'] = 'public, max-age=31536000'
    return response

# if __name__ == '__main__':
#     app.run(debug=True)