from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, send
from dotenv import load_dotenv
import datetime
import os
from typing import List, Dict, Any

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'chave-secreta-padrao')

socketio = SocketIO(app, cors_allowed_origins="*")

usuarios_conectados: List[Dict[str, str]] = []

static_dir = os.path.join(app.root_path, 'static', 'css')
os.makedirs(static_dir, exist_ok=True)

static_js_dir = os.path.join(app.root_path, 'static', 'js')
os.makedirs(static_js_dir, exist_ok=True)

@app.route("/")
def index():
   """Rota principal que redenriza a página do chat"""
   return render_template("index.html")

@socketio.on("connect")
def handle_connect():
   """Evento disparado quando um usuário se conecta"""
   session_id = request.sid
   print(f"Usuário conectado: {session_id}")

@socketio.on("diconnect")
def handle_disconnect():
   """Evento disparado quando um usuário se desconecta"""
   session_id = request.sid
   print(f"Usuário desconectado: {session_id}")

   global usuarios_conectados
   usuarios_conectados = [
      user for user in usuarios_conectados if user['id'] != session_id
   ]

   socketio.emit(
      "user_left", {"total_users": len(usuarios_conectados)}
   )

@socketio.on("join")
def handle_join(data: Dict[str, Any]) -> None:
   """Evento disparado quando um usuário entra no chat com um nome"""
   username = data.get("username")
   if not username:
      emit("errors", {"message", "Nome de usuário é obrigatório"})
      return
   
   session_id = request.sid

   user_info = {"id": session_id, "username": username}
   usuarios_conectados.append(user_info)

   socketio.emit(
      "user_joined",
      {
         "username": username,
         "total_users": len(usuarios_conectados),
         "timestamp": datetime.datetime.now().strftime("%H:%M"),
      }
   )

   print(f"{username} entrou no chat")

@socketio.on("message")
def handle_message(data: Dict[str, Any]) -> None:
   """Evento disparado quando uma mensagem é enviada"""
   session_id = request.sid
   print(f"Messagem recebida de {session_id}: {data}")

   if not data or 'message' not in data:
      emit("error", {"message": "Formato de mensagem inválido"})
      return
   
   sender = next(
      (user for user in usuarios_conectados if user["id"] == session_id), None
   )
   print(f"Remetente enonctrada: {sender}")

   if sender:
      message_data = {
         "username": sender["username"],
         "message": data["message"],
         "timestamp": datetime.datetime.now().strftime("%H:%M")
      }

      print(f"Enviando mensagem para todos: {message_data}")

      socketio.emit("new_message", message_data)

      print(f"{sender["username"]}: {data["message"]}")
   else:
      print(f"Usuário não encontrado para session_id: {session_id}")
      print(f"Usuários conectados: {usuarios_conectados}")

      emit(
         "error",
         {"message", "Usuário não encontrado. Por favor, recarregue a página."}
      )

@socketio.on("typing")
def handle_typing(data: Dict[str, Any]) -> None:
   """Evento disparado quando um usuaŕio está digitando"""
   session_id = request.sid
   sender = next(
      (user for user in usuarios_conectados if user["id"] == session_id), None
   )

   if sender:
      emit(
         "user_typing",
         {
            "username": sender["username"], "typing": data.get("typing", False)
         }, broadcast=True, include_self=False,
      )

if __name__ == "__main__":
   socketio.run(app, debug=True, host="0.0.0.0", port=3000)
