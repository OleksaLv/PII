document.addEventListener('DOMContentLoaded', function() {
    loadChats();
});

function loadChats() {
    fetch(`/api/chats?user_id=${currentUser.id}&auth_token=${authToken}`)
        .then(response => response.json())
        .then(chats => {
            const chatListContent = document.getElementById('chat-list-content');
            chatListContent.innerHTML = '';
            
            if (!chats || chats.length === 0) {
                chatListContent.innerHTML = '<div class="no-chats">No chats found. Create your first chat!</div>';
                return;
            }
            
            chats.forEach((chat, index) => {
                const chatDiv = document.createElement('div');
                chatDiv.className = `chat-item ${index === 0 ? 'active' : ''}`;
                
                const lastMessage = chat.latestMessage ? chat.latestMessage.content : 'No messages yet';
                const lastMessageTime = chat.latestMessage ? formatTime(chat.latestMessage.createdAt) : '';
                
                chatDiv.innerHTML = `
                    <img src="${ASSETS_PATH}/img/profile.jpg" alt="profile">
                    <div class="chat-item-info">
                        <div class="chat-item-name">${chat.chatName}</div>
                        <div class="chat-item-last">${lastMessage}</div>
                    </div>
                    <div class="chat-item-time">${lastMessageTime}</div>
                `;
                
                chatListContent.appendChild(chatDiv);
            });
        })
        .catch(error => {
            const chatListContent = document.getElementById('chat-list-content');
            chatListContent.innerHTML = '<div class="error">Failed to load chats. Please try again.</div>';
        });
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 2) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
}