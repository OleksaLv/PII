<?php require APPROOT . '/views/inc/header.php'; ?>

<div id="content">
  <div class="register-container">
    <h1><?= $data['title'] ?></h1>
    
    <form action="<?= URLROOT ?>/users/register" method="post" class="register-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
        <span class="invalid-feedback"><?= $data['name_err'] ?? '' ?></span>
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
        <span class="invalid-feedback"><?= $data['email_err'] ?? '' ?></span>
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required>
        <span class="invalid-feedback"><?= $data['password_err'] ?? '' ?></span>
      </div>
      
      <div class="form-group">
        <label for="confirm_password">Confirm Password</label>
        <input type="password" id="confirm_password" name="confirm_password" required>
        <span class="invalid-feedback"><?= $data['confirm_password_err'] ?? '' ?></span>
      </div>
      
      <div class="form-buttons">
        <button type="submit" class="btn-register">Register</button>
        <div class="login-link">
          <p>Already have an account?</p>
          <a href="<?= URLROOT ?>/users/login">Login?</a>
        </div>
      </div>
    </form>
  </div>
</div>

<?php require APPROOT . '/views/inc/footer.php'; ?>