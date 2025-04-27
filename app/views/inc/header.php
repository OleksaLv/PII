<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Always included CSS files -->
  <link rel="stylesheet" href="<?= URLROOT ?>/css/general.css">
  <link rel="stylesheet" href="<?= URLROOT ?>/css/header.css">
  <link rel="stylesheet" href="<?= URLROOT ?>/css/notifications-popup.css">
  <link rel="stylesheet" href="<?= URLROOT ?>/css/profile-popup.css">
  <link rel="stylesheet" href="<?= URLROOT ?>/css/navigation.css">
  
  <!-- Page-specific CSS files -->
  <?php if (isset($data['css'])): ?>
    <?php foreach ($data['css'] as $css): ?>
      <link rel="stylesheet" href="<?= URLROOT ?>/css/<?= $css ?>">
    <?php endforeach; ?>
  <?php endif; ?>
  
  <title><?= SITENAME . ($data['title'] ? ' - ' . $data['title'] : '') ?></title>
</head>

<body>
  <header>
    <a id="site-name" href="<?= URLROOT ?>/students"><?= SITENAME ?></a>
    <div class="spacing"></div>
    <?php if(!isLoggedIn()) : ?>
      <a class="register" href="<?= URLROOT ?>/users/register">Register</a>
      <a class="login" href="<?= URLROOT ?>/users/login">Login</a>
    <?php else : ?>
      <a id="notifications" href="<?= URLROOT ?>/messages">
        <img id="notification-icon" src="<?= URLROOT ?>/img/bell.png" alt="notifications">
      </a>
      <a id="profile" href="<?= URLROOT ?>/users/profile">
        <img id="profile-icon" src="<?= URLROOT ?>/img/profile.jpg" alt="profile-icon">
        <p id="profile-name">Oleksii Mahinskyi</p>
      </a>
    <?php endif; ?> 
  </header>