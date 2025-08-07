// Variáveis globais
let socket;
let currentUser = '';
let typingTimeout;

/**
 * Verifica se Socket.IO está disponível
 */
function checkSocketIO() {
    if (typeof io === 'undefined') {
        console.error('Socket.IO não está disponível!');
        alert('Erro: Não foi possível carregar Socket.IO. Verifique sua conexão com a internet e recarregue a página.');
        return false;
    }
    return true;
}

/**
 * Função para entrar no chat
 */
function joinChat() {
    const username = document.getElementById('usernameInput').value.trim();
    
    if (username === '') {
        alert('Por favor, digite seu nome!');
        return;
    }

    if (username.length > 20) {
        alert('Nome muito longo! Máximo 20 caracteres.');
        return;
    }

    // Verifica se Socket.IO está disponível
    if (!checkSocketIO()) {
        return;
    }

    currentUser = username;
    
    try {
        // Conecta ao servidor Socket.IO
        socket = io();
        
        // Oculta o formulário de login e mostra o chat
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'flex';
        
        // Habilita os campos de input
        document.getElementById('messageInput').disabled = false;
        document.getElementById('sendButton').disabled = false;
        document.getElementById('messageInput').focus();

        // Envia evento de entrada no chat
        socket.emit('join', { username: username });

        setupSocketEvents();
    } catch (error) {
        console.error('Erro ao conectar com Socket.IO:', error);
        alert('Erro de conexão. Por favor, recarregue a página.');
    }
}

/**
 * Configura os eventos do Socket.IO
 */
function setupSocketEvents() {
    console.log('Configurando eventos do socket...'); // Debug

    socket.on('connect', function() {
        console.log('Socket conectado! ID:', socket.id); // Debug
        addSystemMessage('Conectado ao servidor!');
    });

    socket.on('disconnect', function() {
        console.log('Socket desconectado'); // Debug
        addSystemMessage('Desconectado do servidor. Tentando reconectar...');
        document.getElementById('messageInput').disabled = true;
        document.getElementById('sendButton').disabled = true;
    });

    socket.on('user_joined', function(data) {
        console.log('Usuário entrou:', data); // Debug
        addSystemMessage(`${data.username} entrou no chat`);
        updateUserCount(data.total_users);
    });

    socket.on('user_left', function(data) {
        console.log('Usuário saiu:', data); // Debug
        updateUserCount(data.total_users);
    });

    socket.on('new_message', function(data) {
        console.log('Nova mensagem recebida:', data); // Debug
        addMessage(data);
    });

    socket.on('user_typing', function(data) {
        console.log('Usuário digitando:', data); // Debug
        showTypingIndicator(data.username, data.typing);
    });

    socket.on('error', function(data) {
        console.error('Erro do socket:', data); // Debug
        alert(data.message);
    });

    // Evento para debugar mensagens enviadas
    socket.on('message_sent', function(data) {
        console.log('Confirmação de envio:', data); // Debug
    });
}

/**
 * Função para enviar mensagem
 */
function sendMessage() {
    console.log('sendMessage() chamada'); // Debug
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    console.log('Mensagem digitada:', message); // Debug
    
    if (message === '') {
        console.log('Mensagem vazia, não enviando'); // Debug
        return;
    }

    // Verifica se socket está conectado
    if (!socket || !socket.connected) {
        console.error('Socket não conectado:', socket); // Debug
        alert('Não foi possível enviar a mensagem. Conexão perdida.');
        return;
    }

    console.log('Enviando mensagem via socket...'); // Debug

    try {
        // Envia a mensagem via Socket.IO
        socket.emit('message', { message: message });
        console.log('Mensagem enviada com sucesso'); // Debug
        
        // Limpa o campo de input
        messageInput.value = '';
        messageInput.focus();
        
        // Para o indicador de digitação
        socket.emit('typing', { typing: false });
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        alert('Erro ao enviar mensagem. Tente novamente.');
    }
}

/**
 * Adiciona uma mensagem ao chat
 * @param {Object} data - Dados da mensagem
 */
function addMessage(data) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    
    const isOwnMessage = data.username === currentUser;
    messageDiv.className = `message ${isOwnMessage ? 'own' : 'other'}`;
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <strong>${data.username}</strong> - ${data.timestamp}
        </div>
        <div>${escapeHtml(data.message)}</div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Adiciona uma mensagem do sistema
 * @param {string} text - Texto da mensagem do sistema
 */
function addSystemMessage(text) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    messageDiv.textContent = text;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Atualiza o contador de usuários online
 * @param {number} count - Número de usuários conectados
 */
function updateUserCount(count) {
    const userCountElement = document.getElementById('userCount');
    userCountElement.textContent = `${count} usuário${count !== 1 ? 's' : ''} online`;
}

/**
 * Mostra ou oculta o indicador de digitação
 * @param {string} username - Nome do usuário que está digitando
 * @param {boolean} isTyping - Se está digitando ou não
 */
function showTypingIndicator(username, isTyping) {
    const typingIndicator = document.getElementById('typingIndicator');
    
    if (isTyping && username !== currentUser) {
        typingIndicator.textContent = `${username} está digitando...`;
    } else {
        typingIndicator.textContent = '';
    }
}

/**
 * Escapa HTML para evitar XSS
 * @param {string} text - Texto a ser escapado
 * @returns {string} - Texto escapado
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Lida com o evento de digitação no campo de mensagem
 */
function handleMessageInputKeypress(e) {
    if (e.key === 'Enter') {
        sendMessage();
    } else {
        // Indica que o usuário está digitando
        if (socket && socket.connected) {
            try {
                socket.emit('typing', { typing: true });
                
                // Para o indicador após 2 segundos de inatividade
                clearTimeout(typingTimeout);
                typingTimeout = setTimeout(() => {
                    if (socket && socket.connected) {
                        socket.emit('typing', { typing: false });
                    }
                }, 2000);
            } catch (error) {
                console.error('Erro ao enviar indicador de digitação:', error);
            }
        }
    }
}

/**
 * Lida com o evento de digitação no campo de nome
 */
function handleUsernameInputKeypress(e) {
    if (e.key === 'Enter') {
        joinChat();
    }
}

/**
 * Inicialização quando a página carrega
 */
function initializeApp() {
    console.log('Inicializando aplicação...'); // Debug
    
    // Foca no input de nome quando a página carrega
    document.getElementById('usernameInput').focus();
    
    // Adiciona event listeners
    const messageInput = document.getElementById('messageInput');
    const usernameInput = document.getElementById('usernameInput');
    const sendButton = document.getElementById('sendButton');
    
    console.log('Elementos encontrados:', { // Debug
        messageInput: !!messageInput,
        usernameInput: !!usernameInput,
        sendButton: !!sendButton
    });
    
    if (messageInput) {
        messageInput.addEventListener('keypress', handleMessageInputKeypress);
        console.log('Event listener adicionado ao messageInput'); // Debug
    }
    
    if (usernameInput) {
        usernameInput.addEventListener('keypress', handleUsernameInputKeypress);
        console.log('Event listener adicionado ao usernameInput'); // Debug
    }
    
    // Event listener para o botão de enviar
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            console.log('Botão enviar clicado!'); // Debug
            sendMessage();
        });
        console.log('Event listener adicionado ao sendButton'); // Debug
    }
}

// Executa a inicialização quando a página carrega
window.onload = initializeApp;