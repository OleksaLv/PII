<?php
class Users extends Controller
{
    private $userModel;

    public function __construct() {
        $this->userModel = $this->model('User');
    }

    public function index() {
        if (!isLoggedIn()) {
            redirect('users/login');
        } else {
            $this->profile(); //Redirect to profile if logged in
        }
    }

    public function register() {
        //Check for POST
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            //Process the form

            //Sanitaze POST data
            $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

            //Init data
            $data = [
                'css' => ['users/register.css'],
                'name' => trim($_POST['name']),
                'email' => trim($_POST['email']),
                'password' => trim($_POST['password']),
                'confirm_password' => trim($_POST['confirm_password']),
                'name_err' => '',
                'email_err' => '',
                'password_err' => '',
                'confirm_password_err' => ''
            ];

            //Validate name
            if(empty($data['name'])) {
                $data['name_err'] = 'Please enter name';
            }

            //Validate email
            if(empty($data['email'])) {
                $data['email_err'] = 'Please enter email';
            } else {
                //Check email
                if($this->userModel->findUserByEmail($data['email'])) {
                    $data['email_err'] = 'Email is already taken';
                }
            }

            //Validate password
            if(empty($data['password'])) {
                $data['password_err'] = 'Please enter password';
            }
            else if(strlen($data['password']) < 6) {
                $data['password_err'] = 'Password must be at least 6 characters';
            }

            //Validate confirm_password
            if(empty($data['confirm_password'])) {
                $data['confirm_password_err'] = 'Please confirm password';
            }
            else {
                if($data['password'] != $data['confirm_password']) {
                    $data['confirm_password_err'] = 'Passwords do not match';
                }
            }

            //Make sure errors are empty
            if(empty($data['name_err']) && empty($data['email_err']) 
                && empty($data['password_err']) && empty($data['confirm_password_err'])) {
                //validated
                
                //Hash password
                $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);

                //Register user
                if($this->userModel->register($data)) {
                    flash('register_success', 'You are registered and can log in');
                    redirect('users/login');
                } else {
                    die('Something went wrong');
                }
            } else {
                //Load view with errors
                $this->view('users/register', $data);
            }
        } else {
            //Init data
            $data = [
                'css' => ['users/register.css'],
                'name' => '',
                'email' => '',
                'password' => '',
                'confirm_password' => '',
                'name_err' => '',
                'email_err' => '',
                'password_err' => '',
                'confirm_password_err' => ''
            ];

            //Load the view
            $this->view('users/register', $data);
        }
    }

    public function login() {
        //Check for POST
        if($_SERVER['REQUEST_METHOD'] == 'POST') {
            //Process the form

            //Sanitaze POST data
            $_POST = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);

            //Init data
            $data = [
                'css' => ['users/login.css'],
                'email' => trim($_POST['email']),
                'password' => trim($_POST['password']),
                'email_err' => '',
                'password_err' => '',
            ];

            //Validate email
            if(empty($data['email'])) {
                $data['email_err'] = 'Please enter email';
            }

            //Validate password
            if(empty($data['password'])) {
                $data['password_err'] = 'Please enter password';
            }

            //Check for user with email if email is not empty
            if(!empty($data['email']) &&
                $this->userModel->findUserByEmail($data['email'])) {
                //User found
            } else if (!empty($data['email'])) {
                //Set error if no previous errors
                $data['email_err'] = 'No user found';
            }

            //Make sure errors are empty
            if(empty($data['email_err']) && empty($data['password_err'])) {
                //validated
                
                $loggedInUser = $this->userModel->login($data['email'], $data['password']);

                if($loggedInUser) {
                    //Create Session
                    $this->createUserSession($loggedInUser);
                } else {
                    $data['password_err'] = 'Password incorrect';

                    $this->view('students', $data);
                }
            } else {
                //Load view with errors
                $this->view('users/login', $data);
            }

        } else {
            //Init data
            $data = [
                'css' => ['users/login.css'],
                'email' => '',
                'password' => '',
                'email_err' => '',
                'password_err' => '',
            ];

            //Load the view
            $this->view('users/login', $data);
        }
    }

    public function createUserSession($user) {
        $_SESSION['user_id'] = $user->id;
        $_SESSION['user_email'] = $user->email;
        $_SESSION['user_name'] = $user->name;
        redirect('students');
    }

    public function logout() {
        unset($_SESSION['user_id']);
        unset($_SESSION['user_email']);
        unset($_SESSION['user_name']);
        session_destroy();
        redirect('users/login');
    }

    public function profile($id = null) {
        if (!isLoggedIn()) {
            redirect('users/login');
        }

        if ($id) {
            //Try to access another user's profile by db
        } else {
            //Access own profile
            $id = $_SESSION['user_id'];
        }

        $data = [
            'css' => ['users/profile.css'],
            'title' => 'Profile'
        ];
        
        $this->view('users/profile', $data);
    }
}