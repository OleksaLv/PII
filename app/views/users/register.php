<?php require APPROOT . '/views/inc/header.php'; ?>

<div id="content">
  <div class="register-container">
    <h1>Register</h1>
    
    <form action="<?= URLROOT ?>/users/register" method="post" class="register-form">
      <div class="form-fields-container">
        <div class="form-group">
          <label for="group">Group<sup>*</sup></label>
          <select id="group" name="group" class="select-field <?= (!empty($data['group_id_err'])) ? 'is-invalid' : '' ?>">
            <option value="" disabled <?= empty($data['group_id']) ? 'selected' : '' ?>>Select group</option>
            <?php if(isset($data['groups'])): ?>
              <?php foreach($data['groups'] as $group): ?>
                <option value="<?= $group->id ?>" <?= (isset($data['group_id']) && $data['group_id'] == $group->id) ? 'selected' : '' ?>><?= $group->name ?></option>
              <?php endforeach; ?>
            <?php endif; ?>
          </select>
          <span class="invalid-feedback"><?= $data['group_id_err'] ?? '' ?></span>
        </div>
            
        <div class="form-group">
          <label for="first-name">First Name<sup>*</sup></label>
          <input type="text" id="first-name" name="first-name" 
                 class="<?= (!empty($data['first_name_err'])) ? 'is-invalid' : '' ?>" 
                 value="<?= $data['first_name'] ?>">
          <span class="invalid-feedback"><?= $data['first_name_err'] ?? '' ?></span>
        </div>

        <div class="form-group">
          <label for="last-name">Last Name<sup>*</sup></label>
          <input type="text" id="last-name" name="last-name" 
                 class="<?= (!empty($data['last_name_err'])) ? 'is-invalid' : '' ?>" 
                 value="<?= $data['last_name'] ?>">
          <span class="invalid-feedback"><?= $data['last_name_err'] ?? '' ?></span>
        </div>
        
        <div class="form-group">
          <label for="gender">Gender<sup>*</sup></label>
          <select id="gender" name="gender" 
                  class="select-field <?= (!empty($data['gender_err'])) ? 'is-invalid' : '' ?>">
            <option value="" disabled <?= empty($data['gender']) ? 'selected' : '' ?>>Select gender</option>
            <option value="female" <?= (isset($data['gender']) && $data['gender'] == 'female') ? 'selected' : '' ?>>Female</option>
            <option value="male" <?= (isset($data['gender']) && $data['gender'] == 'male') ? 'selected' : '' ?>>Male</option>
          </select>
          <span class="invalid-feedback"><?= $data['gender_err'] ?? '' ?></span>
        </div>

        <div class="form-group">
          <label for="birthday">Birthday<sup>*</sup></label>
          <input type="date" id="birthday" name="birthday" 
                class="input-field <?= (!empty($data['birthday_err'])) ? 'is-invalid' : '' ?>" 
                value="<?= $data['birthday'] ?? '' ?>"
                min="1900-01-01" max="2010-01-01">
          <span class="invalid-feedback"><?= $data['birthday_err'] ?? '' ?></span>
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