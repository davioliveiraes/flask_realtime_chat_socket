# Chat em Tempo Real - Flask + SocketIO

Um sistema de chat em tempo real desenvolvido com Flask e Flask-SocketIO.

## 🎥 Demonstração

Confira o sistema funcionando no vídeo demonstrativo:

**[▶️ Assistir demonstração no YouTube](https://www.youtube.com/watch?v=0E17ZHDz8cw)**

## 🚀 Funcionalidades

- ✅ Chat em tempo real entre múltiplos usuários
- ✅ Notificações de entrada e saída de usuários
- ✅ Indicador de "está digitando"
- ✅ Contador de usuários online
- ✅ Interface responsiva
- ✅ Mensagens com timestamp
- ✅ Sistema de login simples
- ✅ Escape de HTML para segurança

## 📋 Pré-requisitos

- Python 3.7+
- pip (gerenciador de pacotes Python)

## 🔧 Instalação

1. **Clone ou baixe o projeto**
   ```bash
   git clone https://github.com/davioliveiraes/flask-realtime-chat.git
   cd flask-realtime-chat
   ```

2. **Crie um ambiente virtual (recomendado)**
   ```bash
   python -m venv venv
   
   # No Windows
   venv\Scripts\activate
   
   # No Linux/Mac
   source venv/bin/activate
   ```

3. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   ```

## 🏃‍♂️ Como Executar

1. **Execute o servidor**
   ```bash
   python app.py
   ```

2. **Acesse o chat**
   - Abra seu navegador
   - Vá para: `http://localhost:3000`
   - Digite seu nome e comece a conversar!

3. **Teste com múltiplos usuários**
   - Abra várias abas do navegador
   - Use diferentes nomes em cada aba
   - Veja o chat funcionando em tempo real

## 📁 Estrutura do Projeto

```
chat-tempo-real/
│
├── app.py                 # Servidor Flask principal
├── requirements.txt       # Dependências do projeto
├── README.md             # Este arquivo
│
├── templates/
│   └── index.html        # Interface HTML do chat
│
└── static/
    ├── css/
    │   └── style.css     # Estilos CSS
    └── js/
        └── chat.js       # Lógica JavaScript do frontend
```

## 🛠️ Tecnologias Utilizadas

- **Flask**: Framework web Python
- **Flask-SocketIO**: Extensão para WebSockets
- **Socket.IO**: Biblioteca JavaScript para comunicação em tempo real
- **HTML/CSS/JavaScript**: Interface frontend