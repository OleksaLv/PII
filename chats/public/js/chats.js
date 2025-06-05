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
                chatDiv.style.cursor = 'pointer';
                
                let lastMessage = 'No messages yet';
                let lastMessageTime = '';
                let senderPrefix = '';
                
                if (chat.latestMessage) {
                    lastMessage = chat.latestMessage.content;
                    lastMessageTime = formatTime(chat.latestMessage.createdAt);
                    
                    // Check if the sender is the current user
                    if (chat.latestMessage.sender == currentUser.id) {
                        senderPrefix = 'You: ';
                    } else if (chat.latestMessage.senderDetails) {
                        senderPrefix = `${chat.latestMessage.senderDetails.first_name}: `;
                    } else {
                        senderPrefix = 'Unknown: ';
                    }
                    
                    lastMessage = senderPrefix + lastMessage;
                }
                
                chatDiv.innerHTML = `
                    <img src="${ASSETS_PATH}/img/profile.jpg" alt="profile">
                    <div class="chat-item-info">
                        <div class="chat-item-name">${chat.chatName}</div>
                        <div class="chat-item-last">${lastMessage}</div>
                    </div>
                    <div class="chat-item-time">${lastMessageTime}</div>
                `;
                
                chatDiv.addEventListener('click', () => {
                    window.location.href = `/messages/${chat._id}?user_id=${currentUser.id}&auth_token=${authToken}`;
                });
                
                chatListContent.appendChild(chatDiv);
            });
        })
        .catch(error => {
            console.error('Error loading chats:', error);
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