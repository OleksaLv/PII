let notificationSocket;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Notifications script loaded');
    
    if (typeof io !== 'undefined' && window.currentUser) {
        console.log('Initializing notification socket for user:', window.currentUser.id);
        
        // Check if we already have a socket connection from messages.js
        if (typeof socket !== 'undefined') {
            notificationSocket = socket;
            console.log('Using existing socket connection');
        } else {
            notificationSocket = io();
            console.log('Created new socket connection');
        }
        
        // Connect user to their notification room
        notificationSocket.emit('user-connect', { userId: window.currentUser.id });
        console.log('Emitted user-connect for user:', window.currentUser.id);
        
        // Listen for new notifications
        notificationSocket.on('new-notification', function(notification) {
            console.log('Received new notification:', notification);
            
            // Trigger notification animation
            triggerNotificationAnimation();
            
            // Reload notifications
            loadNotifications();
        });
        
        // Load notifications on page load
        loadNotifications();
    } else {
        console.log('Socket.io not available or no current user');
    }
});

function triggerNotificationAnimation() {
    const notificationsLink = document.getElementById('notifications');
    
    if (notificationsLink) {
        // Remove class if it exists
        notificationsLink.classList.remove('has-notifications');
        
        // Force reflow
        notificationsLink.offsetHeight;
        
        // Add class to trigger animation
        notificationsLink.classList.add('has-notifications');
        
        // Remove class after animation completes (4.5s = 1.5s * 3 iterations)
        setTimeout(() => {
            notificationsLink.classList.remove('has-notifications');
        }, 4500);
    }
}

async function loadNotifications() {
    try {
        if (!window.currentUser || !window.authToken) {
            console.log('No user or auth token available');
            return;
        }
        
        console.log('Loading notifications for user:', window.currentUser.id);
        const response = await fetch(`/api/notifications?user_id=${window.currentUser.id}&auth_token=${window.authToken}`);
        const notifications = await response.json();
        
        console.log('Loaded notifications:', notifications);
        displayNotifications(notifications);
        
        // If there are notifications on page load, show animation once
        if (notifications && notifications.length > 0) {
            const notificationsLink = document.getElementById('notifications');
            if (notificationsLink && !notificationsLink.classList.contains('has-notifications')) {
                triggerNotificationAnimation();
            }
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function displayNotifications(notifications) {
    const notificationsContent = document.getElementById('notifications-content');
    
    if (!notificationsContent) {
        console.log('Notifications content element not found');
        return;
    }
    
    if (!notifications || notifications.length === 0) {
        notificationsContent.innerHTML = '<div class="no-notifications">No new notifications</div>';
        console.log('No notifications to display');
        return;
    }
    
    console.log('Displaying', notifications.length, 'notifications');
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
        console.log('Opening notification chat:', chatId, notificationId);
        
        // Delete the notification
        await fetch(`/api/notifications/${notificationId}?user_id=${window.currentUser.id}&auth_token=${window.authToken}`, {
            method: 'DELETE'
        });
        
        // Reload notifications to update the popup
        await loadNotifications();
        
        // Navigate to the chat
        window.location.href = `/messages/${chatId}?user_id=${window.currentUser.id}&auth_token=${window.authToken}`;
    } catch (error) {
        console.error('Error opening notification chat:', error);
    }
}