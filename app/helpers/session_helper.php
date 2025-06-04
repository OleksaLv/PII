<?php
  // Configure session settings for sharing with Node.js
  ini_set('session.save_handler', 'files');
  ini_set('session.name', 'PHPSESSID');
  ini_set('session.cookie_httponly', 0); // Allow JavaScript access for Node.js
  ini_set('session.cookie_secure', 0); // Allow over HTTP
  ini_set('session.cookie_samesite', 'Lax'); // Allow cross-origin requests
  ini_set('session.cookie_domain', ''); // Allow localhost domains
  
  // Set session save path to a shared location that Node.js can access
  $sessionPath = sys_get_temp_dir() . '/php_sessions';
  if (!is_dir($sessionPath)) {
      mkdir($sessionPath, 0777, true);
  }
  ini_set('session.save_path', $sessionPath);
  
  session_start();

  //Flash Message Helper
  //Example - flash('register_success', 'You are now registered', 'alert alert-danger');
  //Display in a view - <?php echo flash('register_success');
  function flash($name = '', $message = '', $class = 'alert alert-success') {
    if(!empty($name)) {
        if(!empty($message) && empty($_SESSION[$name])) {
            if(!empty($_SESSION[$name . '_class'])) {
                unset($_SESSION[$name . '_class']);
            }

            $_SESSION[$name] = $message;
            $_SESSION[$name . '_class'] = $class;
        } else if (empty($message) && !empty($_SESSION[$name])) {
            $class = !empty($_SESSION[$name . '_class']) ? $_SESSION[$name . '_class'] : '';
            echo '<div class="' . $class . '"' . ' id="msg-flash">' . $_SESSION[$name] . '</div>';
            unset($_SESSION[$name]);
            unset($_SESSION[$name . '_class']);
        }
    }
  }

  function isLoggedIn() {
    if(isset($_SESSION['user_id'])) {
        return true;
    } else {
        return false;
    }
}