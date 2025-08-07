# 💬 Chat em Tempo Real - Flask SocketIO

Chat simples em Python onde várias pessoas podem conversar ao mesmo tempo no navegador.

## 📦 Instalação

```bash
# Clone o projeto
git clone https://github.com/davioliveiraes/flask-realtime-chat.git
cd flask-realtime-chat

# Crie ambiente virtual
python -m venv venv

# Ative o ambiente
# Linux/Mac: source venv/bin/activate
# Windows: venv\Scripts\activate

# Instale dependências
pip install -r requirements.txt
```

## ▶️ Como usar

```bash
# Execute o servidor
python app.py

# Abra no navegador
http://localhost:3000
```

Para testar: abra várias abas do navegador, entre com nomes diferentes e converse!

## 📁 Estrutura

```
├── app.py              # Servidor
├── requirements.txt    # Dependências
├── templates/
│   └── index.html     # Página HTML
└── static/
    ├── css/
    │   └── style.css  # Estilos
    └── js/
        └── chat.js    # JavaScript
```

## 🛠 Tecnologias

- Python + Flask + SocketIO (backend)
- HTML + CSS + JavaScript (frontend)
- WebSockets para comunicação em tempo real

**Dica:** Use `CTRL+C` para parar o servidor.