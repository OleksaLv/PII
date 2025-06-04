let searchTimeout;
let selectedUsers = [];

document.addEventListener('DOMContentLoaded', function() {
    const userSearch = document.getElementById('userSearch');
    const createChatSubmit = document.getElementById('create-chat-submit');
    
    if (!userSearch || !createChatSubmit) {
        return;
    }
    
    userSearch.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const searchTerm = this.value.trim();
        
        if (searchTerm.length < 3) {
            document.getElementById('search-results').innerHTML = '';
            return;
        }
        
        searchTimeout = setTimeout(() => {
            searchUsers(searchTerm);
        }, 300);
    });
    
    createChatSubmit.addEventListener('click', function(e) {
        e.preventDefault();
        createChat();
    });
});

async function searchUsers(searchTerm) {
    try {
        const url = `/api/search-users?term=${encodeURIComponent(searchTerm)}&user_id=${currentUser.id}&auth_token=${authToken}`;
        const response = await fetch(url);
        const users = await response.json();
        displaySearchResults(users);
    } catch (error) {
        console.error('Search error:', error);
    }
}

function displaySearchResults(users) {
    const searchResults = document.getElementById('search-results');
    
    if (users.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No users found</div>';
        return;
    }
    
    searchResults.innerHTML = users.map(user => `
        <div class="search-result-item" onclick="selectUser(${user.id}, '${user.first_name}', '${user.last_name}', '${user.email}')">
            <img src="${ASSETS_PATH}/img/profile.jpg" alt="profile">
            <div class="user-info">
                <div class="user-name">${user.first_name} ${user.last_name}</div>
                <div class="user-email">${user.email}</div>
            </div>
        </div>
    `).join('');
}

function selectUser(userId, firstName, lastName, email) {
    if (selectedUsers.find(u => u.id === userId)) {
        return;
    }
    
    selectedUsers.push({
        id: userId,
        firstName: firstName,
        lastName: lastName,
        email: email
    });
    
    updateSelectedUsersList();
    document.getElementById('search-results').innerHTML = '';
    document.getElementById('userSearch').value = '';
}

function removeUser(userId) {
    selectedUsers = selectedUsers.filter(u => u.id !== userId);
    updateSelectedUsersList();
}

function updateSelectedUsersList() {
    const selectedUsersList = document.getElementById('selected-users-list');
    
    if (selectedUsers.length === 0) {
        selectedUsersList.innerHTML = '<div class="no-users">No users selected</div>';
        return;
    }
    
    selectedUsersList.innerHTML = selectedUsers.map(user => `
        <div class="selected-user-item">
            <img src="${ASSETS_PATH}/img/profile.jpg" alt="profile">
            <div class="user-info">
                <div class="user-name">${user.firstName} ${user.lastName}</div>
                <div class="user-email">${user.email}</div>
            </div>
            <button class="remove-user" onclick="removeUser(${user.id})">×</button>
        </div>
    `).join('');
}

async function createChat() {
    if (selectedUsers.length === 0) {
        alert('Please select at least one user');
        return;
    }
    
    try {
        const userIds = selectedUsers.map(u => u.id);
        
        const response = await fetch(`/api/create-chat?user_id=${currentUser.id}&auth_token=${authToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                users: userIds,
                isGroupChat: userIds.length > 1
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            window.location.href = `/chats?user_id=${currentUser.id}&auth_token=${authToken}`;
        } else {
            alert('Failed to create chat: ' + (result.error || 'Unknown error'));
        }
    } catch (error) {
        alert('Failed to create chat. Please try again.');
    }
}