const socket = io();
let name = prompt('Please enter your name: ');
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');
let typingStatus = document.querySelector('#typingStatus');
let typingTimeout;

// Listen for 'keyup' event to detect typing
textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    } else {
        socket.emit('typing', { name, isTyping: true });
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => socket.emit('typing', { name, isTyping: false }), 1000);
    }
});

// Send message to the server
function sendMessage(message) {
    let msg = { user: name, message: message.trim() };
    appendMessage(msg, 'outgoing');
    textarea.value = '';
    socket.emit('message', msg);
}

// Append message to the chat
function appendMessage(msg, type) {
    let div = document.createElement('div');
    div.classList.add(type, 'message');
    div.innerHTML = `<h4>${msg.user}</h4><p>${msg.message}</p>`;
    messageArea.appendChild(div);
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Listen for incoming messages and typing status
socket.on('message', (msg) => appendMessage(msg, 'incoming'));
socket.on('typing', (data) => typingStatus.innerHTML = data.isTyping ? `${data.name} is typing...` : '');
