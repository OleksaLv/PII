const socket = io();
const onlineUsers = new Set();

document.addEventListener('DOMContentLoaded', function() {
    // Connect user to their notification room
    socket.emit('user-connect', { userId: currentUser.id });
    
    socket.emit('join-chat', { chatId, userId: currentUser.id });
    loadMessages();
    loadChatUsers();
    
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    socket.on('new-message', function(message) {
        const noMessages = document.querySelector('.no-messages');
        if (noMessages) {
            noMessages.remove();
        }
        displayMessage(message);
        scrollToBottom();
    });
    
    socket.on('user-joined', function(userId) {
        onlineUsers.add(userId);
        updateUserStatus(userId, true);
    });
    
    socket.on('user-left', function(userId) {
        onlineUsers.delete(userId);
        updateUserStatus(userId, false);
    });
    
    socket.on('online-users', function(users) {
        users.forEach(userId => {
            onlineUsers.add(userId);
            updateUserStatus(userId, true);
        });
    });
});

function loadChatUsers() {
    const usersList = document.getElementById('users-list');
    chatUsers.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'user-item';
        userItem.dataset.userId = user.id;
        
        userItem.innerHTML = `
            <img src="${ASSETS_PATH}/img/profile.jpg" alt="profile">
            <span class="user-name">${user.first_name} ${user.last_name}</span>
            <div class="user-status"></div>
        `;
        
        usersList.appendChild(userItem);
    });
}

function updateUserStatus(userId, isOnline) {
    const userItem = document.querySelector(`[data-user-id="${userId}"]`);
    if (userItem) {
        const statusElement = userItem.querySelector('.user-status');
        statusElement.className = `user-status ${isOnline ? 'online' : ''}`;
    }
}

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