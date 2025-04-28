<?php require APPROOT . '/views/inc/header.php'; ?>

<div id="content">
  <div class="register-container">
    <h1>Register</h1>
    
    <form action="<?= URLROOT ?>/users/register" method="post" class="register-form">
      <div class="form-group">
        <label for="name">Name<sup>*</sup></label>
        <input type="text" id="name" name="name" 
               class="<?= (!empty($data['name_err'])) ? 'is-invalid' : '' ?>" 
               value="<?= $data['name'] ?>">
        <span class="invalid-feedback"><?= $data['name_err'] ?? '' ?></span>
      </div>
      
      <div class="form-group">
        <label for="email">Email<sup>*</sup></label>
        <input type="email" id="email" name="email" 
               class="<?= (!empty($data['email_err'])) ? 'is-invalid' : '' ?>" 
               value="<?= $data['email'] ?>">
        <span class="invalid-feedback"><?= $data['email_err'] ?? '' ?></span>
      </div>
      
      <div class="form-group">
        <label for="password">Password<sup>*</sup></label>
        <input type="password" id="password" name="password" 
               class="<?= (!empty($data['password_err'])) ? 'is-invalid' : '' ?>" 
               value="<?= $data['password'] ?>">
        <span class="invalid-feedback"><?= $data['password_err'] ?? '' ?></span>
      </div>
      
      <div class="form-group">
        <label for="confirm_password">Confirm Password<sup>*</sup></label>
        <input type="password" id="confirm_password" name="confirm_password" 
               class="<?= (!empty($data['confirm_password_err'])) ? 'is-invalid' : '' ?>" 
               value="<?= $data['confirm_password'] ?>">
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