<?php require APPROOT . '/views/inc/header.php'; ?>

<div id="content">
  <?php require APPROOT . '/views/inc/navigation.php'; ?>
  
  <section class="profile-section">
    <h1><?= $data['title'] ?></h1>
    
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-image">
          <!-- This should be replaced with user's actual profile image -->
          <img src="<?= URLROOT ?>/img/profile.jpg" alt="Profile Image">
        </div>
        <div class="profile-info">
          <!-- Replace with actual user data from database -->
          <h2>Oleksii Mahinskyi</h2>
          <p class="profile-role">Administrator</p>
        </div>
      </div>
      
      <div class="profile-body">
        <div class="info-card">
          <h3>Personal Information</h3>
          <div class="info-row">
            <span class="info-label">Email</span>
            <!-- Replace with actual user email from database -->
            <span class="info-value">user@example.com</span>
          </div>
          <div class="info-row">
            <span class="info-label">Member Since</span>
            <!-- Replace with actual join date from database -->
            <span class="info-value">April 24, 2025</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<?php require APPROOT . '/views/inc/footer.php'; ?>