<div id="notifications-popup" class="popup">
  <div class="popup-body">
    <div id="notifications-content">
      <div class="no-notifications">Loading notifications...</div>
    </div>
  </div>
</div>

<div id="profile-popup" class="popup">
  <div class="popup-body">
    <a href="<?= URLROOT ?>/users/profile">Profile</a>
    <a href="<?= URLROOT ?>/users/logout">Log out</a>
  </div>
</div>

<script>
  // Make URLROOT available globally to JavaScript
  window.URLROOT = '<?= URLROOT ?>';
  
  <?php if(isLoggedIn()): ?>
  // Make user data available to JavaScript for notifications
  window.currentUser = {
    id: <?= $_SESSION['user_id'] ?>,
    first_name: '<?= $_SESSION['user_first_name'] ?>',
    last_name: '<?= $_SESSION['user_last_name'] ?>',
    email: '<?= $_SESSION['user_email'] ?>'
  };
  
  // Generate auth token for Node.js API calls
  window.authToken = '<?= md5($_SESSION['user_id'] . $_SESSION['user_email'] . 'cheese and potato') ?>';
  window.ASSETS_PATH = '<?= URLROOT ?>';
  <?php endif; ?>
</script>

<?php if(isLoggedIn()): ?>
<script src="http://localhost:3000/socket.io/socket.io.js"></script>
<script src="<?= URLROOT ?>/js/php-notifications.js"></script>
<?php endif; ?>

<script src="<?= URLROOT ?>/js/main.js"></script>
</body>
</html>