<?php require APPROOT . '/views/inc/header.php'; ?>

<div id="content">
  <div class="login-container">
    <?php flash('register_success'); ?>
    <h1>Login</h1>
    <form action="<?= URLROOT ?>/users/login" method="post" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" value="<?= $data['email'] ?? '' ?>">
        <span class="invalid-feedback"><?= $data['email_err'] ?? '' ?></span>
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" value="<?= $data['password'] ?? '' ?>">
        <span class="invalid-feedback"><?= $data['password_err'] ?? '' ?></span>
      </div>
      
      <div class="form-buttons">
        <button type="submit" class="btn-login">Login</button>
        <div class="signup-link">
          <p>Don't have an account?</p>
          <a href="<?= URLROOT ?>/users/register">Sign up?</a>
        </div>
      </div>
    </form>
  </div>
</div>

<?php require APPROOT . '/views/inc/footer.php'; ?>