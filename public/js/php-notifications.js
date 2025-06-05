let notificationSocket;
let hasTriggeredInitialAnimation = false;
let pollingInterval;

document.addEventListener('DOMContentLoaded', function() {
    if (window.currentUser) {
        loadNotifications();
        
        if (typeof io !== 'undefined') {
            initializeSocket();
        } else {
            startNotificationPolling();
        }
    }
});

function initializeSocket() {
    try {
        notificationSocket = io('http://localhost:3000', {
            transports: ['websocket', 'polling'],
            withCredentials: false,
            forceNew: true,
            timeout: 5000
        });
        
        notificationSocket.on('connect', function() {
            if (pollingInterval) {
                clearInterval(pollingInterval);
                pollingInterval = null;
            }
            
            notificationSocket.emit('user-connect', { userId: window.currentUser.id });
        });
        
        notificationSocket.on('connect_error', function(error) {
            startNotificationPolling();
        });
        
        notificationSocket.on('disconnect', function() {
            startNotificationPolling();
        });
        
        notificationSocket.on('new-notification', function(notification) {
            triggerNotificationAnimation();
            loadNotifications();
        });
        
    } catch (error) {
        startNotificationPolling();
    }
}

function startNotificationPolling() {
    if (pollingInterval) {
        return;
    }
    
    let lastNotificationCount = 0;
    
    pollingInterval = setInterval(async function() {
        try {
            const response = await fetch(`http://localhost:3000/api/notifications?user_id=${window.currentUser.id}&auth_token=${window.authToken}`);
            
            if (response.ok) {
                const notifications = await response.json();
                
                if (notifications.length > lastNotificationCount && lastNotificationCount > 0) {
                    triggerNotificationAnimation();
                }
                
                lastNotificationCount = notifications.length;
                displayNotifications(notifications);
                
                if (notifications.length > 0 && !hasTriggeredInitialAnimation) {
                    triggerNotificationAnimation();
                    hasTriggeredInitialAnimation = true;
                }
            }
        } catch (error) {
            displayOfflineMessage();
        }
    }, 5000);
}

function displayOfflineMessage() {
    const notificationsContent = document.getElementById('notifications-content');
    if (notificationsContent) {
        notificationsContent.innerHTML = '<div class="no-notifications">Chat server offline</div>';
    }
}

function triggerNotificationAnimation() {
    const notificationsLink = document.getElementById('notifications');
    
    if (notificationsLink) {
        notificationsLink.classList.remove('has-notifications');
        notificationsLink.offsetHeight;
        notificationsLink.classList.add('has-notifications');
        
        setTimeout(() => {
            notificationsLink.classList.remove('has-notifications');
        }, 4500);
    }
}

async function loadNotifications() {
    try {
        if (!window.currentUser || !window.authToken) {
            return;
        }
        
        const response = await fetch(`http://localhost:3000/api/notifications?user_id=${window.currentUser.id}&auth_token=${window.authToken}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const notifications = await response.json();
        displayNotifications(notifications);
        
        if (notifications && notifications.length > 0 && !hasTriggeredInitialAnimation) {
            triggerNotificationAnimation();
            hasTriggeredInitialAnimation = true;
        }
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            displayOfflineMessage();
        } else {
            displayNotifications([]);
        }
    }
}

function displayNotifications(notifications) {
    const notificationsContent = document.getElementById('notifications-content');
    
    if (!notificationsContent) {
        return;
    }
    
    if (!notifications || notifications.length === 0) {
        notificationsContent.innerHTML = '<div class="no-notifications">No new notifications</div>';
        return;
    }
    
    notificationsContent.innerHTML = notifications.map(notification => {
        const senderName = notification.senderDetails ? 
            `${notification.senderDetails.first_name} ${notification.senderDetails.last_name}` : 
            'Unknown User';
        
        return `
            <div class="notification" onclick="openNotificationChat('${notification.chatId}', '${notification._id}')">
                <div>
                    <img src="${window.ASSETS_PATH}/img/profile.jpg" alt="profile">
                    <p>${senderName}</p>
                </div>
                <p>${notification.content}</p>
            </div>
        `;
    }).join('');
}

async function openNotificationChat(chatId, notificationId) {
    try {
        await fetch(`http://localhost:3000/api/notifications/${notificationId}?user_id=${window.currentUser.id}&auth_token=${window.authToken}`, {
            method: 'DELETE'
        });
        
        await loadNotifications();
        
        window.location.href = `http://localhost:3000/messages/${chatId}?user_id=${window.currentUser.id}&auth_token=${window.authToken}`;
    } catch (error) {
        console.error('Error opening notification chat:', error);
    }
}