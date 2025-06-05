const socket = io();

document.addEventListener('DOMContentLoaded', function() {
    socket.emit('join-chat', chatId);
    loadMessages();
    
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    socket.on('new-message', function(message) {
        // Remove "no messages" text if it exists
        const noMessages = document.querySelector('.no-messages');
        if (noMessages) {
            noMessages.remove();
        }
        displayMessage(message);
        scrollToBottom();
    });
});

function loadMessages() {
    fetch(`/api/messages/${chatId}?user_id=${currentUser.id}&auth_token=${authToken}`)
        .then(response => response.json())
        .then(messages => {
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.innerHTML = '';
            
            if (messages.length === 0) {
                chatMessages.innerHTML = '<div class="no-messages">No messages yet. Start the conversation!</div>';
            } else {
                messages.forEach(message => {
                    displayMessage(message);
                });
                scrollToBottom();
            }
        })
        .catch(error => {
            console.error('Error loading messages:', error);
        });
}

function displayMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    const isCurrentUser = message.sender === currentUser.id;
    
    messageDiv.className = `message ${isCurrentUser ? 'sent' : 'received'}`;
    
    const senderName = message.senderDetails ? 
        `${message.senderDetails.first_name} ${message.senderDetails.last_name}` : 
        'Unknown User';
    
    const messageTime = new Date(message.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    if (isCurrentUser) {
        messageDiv.innerHTML = `
            <div class="message-header">
                <span class="time">${messageTime}</span>
            </div>
            <div class="message-content">${message.content}</div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-header">
                <img src="${ASSETS_PATH}/img/profile.jpg" alt="profile">
                <span class="sender">${senderName}</span>
                <span class="time">${messageTime}</span>
            </div>
            <div class="message-content">${message.content}</div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const content = messageInput.value.trim();
    
    if (!content) {
        return;
    }
    
    console.log('Sending message:', { chatId, content, userId: currentUser.id });
    
    socket.emit('send-message', {
        chatId: chatId,
        content: content,
        userId: currentUser.id
    });
    
    messageInput.value = '';
}