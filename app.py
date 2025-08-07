from flask import Flask, render_template, request
from flask_socketio import SocketIO
from dotenv import load_dotenv
import datetime
import os

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

socketio = SocketIO(app, cors_allowed_origins="*")

connected_users = []

static_dir = os.path.join(app.root_path, 'static', 'css')
os.makedirs(static_dir, exist_ok=True)

static_js_dir = os.path.join(app.root_path, 'static', 'js')
os.makedirs(static_js_dir, exist_ok=True)

@app.route('/')
def index():
   """Rota principal que renderiza a pagina do chat"""
   return render_template('index.html')


if __name__ == '__main__':
   socketio.run(app, debug=True, host="0.0.0.0", port=3000)