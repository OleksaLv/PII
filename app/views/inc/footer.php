<div id="notifications-popup" class="popup">
  <div class="popup-body">
    <div class="notification">
      <div>
        <img src="<?= URLROOT ?>/img/profile.jpg" alt="profile">
        <p>Admin</p>
      </div>
      <p>Hello, my dear friend. I'm glad</p>
    </div>
    <div class="notification">
      <div>
        <img src="<?= URLROOT ?>/img/profile.jpg" alt="profile">
        <p>John K.</p>
      </div>
      <p>James Bond has sent you a message</p>
    </div>
    <div class="notification">
      <div>
        <img src="<?= URLROOT ?>/img/profile.jpg" alt="profile">
        <p>Ann S.</p>
      </div>
      <p>James Bond has sent you an age</p>
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
</script>
<script src="<?= URLROOT ?>/js/main.js"></script>
</body>
</html>