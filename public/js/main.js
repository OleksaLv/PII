//Notification popup
const notifications = document.getElementById('notifications');
const notificationsPopup = document.getElementById('notifications-popup');

if (notifications && notificationsPopup) {
    notifications.addEventListener('mouseenter', function() {
        if (profilePopup) profilePopup.style.display = 'none';
        notificationsPopup.style.display = 'block';
    });

    notificationsPopup.addEventListener('mouseleave', function() {
        notificationsPopup.style.display = 'none';
    });
}

//Profile popup
const profile = document.getElementById('profile');
const profilePopup = document.getElementById('profile-popup');

if (profile && profilePopup) {
    profile.addEventListener('mouseenter', function() {
        if (notificationsPopup) notificationsPopup.style.display = 'none';
        profilePopup.style.display = 'block';
    });

    profilePopup.addEventListener('mouseleave', function() {
        profilePopup.style.display = 'none';
    });
}