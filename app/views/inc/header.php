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
  
  <title><?= SITENAME . (isset($data['title']) ? (' - ' . $data['title']) : '') ?></title>
</head>

<body>
  <header>
    <a id="site-name" href="<?= URLROOT ?>/students"><?= SITENAME ?></a>
    <div class="spacing"></div>
    <?php if(!isLoggedIn()) : ?>
      <a class="register" href="<?= URLROOT ?>/users/register">Register</a>
      <a class="login" href="<?= URLROOT ?>/users/login">Login</a>
    <?php else : ?>
      <a id="notifications" href="http://localhost:3000/chats?user_id=<?= $_SESSION['user_id'] ?>&auth_token=<?= md5($_SESSION['user_id'] . $_SESSION['user_email'] . 'cheese and potato') ?>">
        <img id="notification-icon" src="<?= URLROOT ?>/img/bell.png" alt="notifications">
      </a>
      <a id="profile" href="<?= URLROOT ?>/users/profile">
        <img id="profile-icon" src="<?= URLROOT ?>/img/profile.jpg" alt="profile-icon">
        <p id="profile-name"><?= $_SESSION['user_first_name'] . " " . $_SESSION['user_last_name'] ?></p>
      </a>
    <?php endif; ?> 
  </header>