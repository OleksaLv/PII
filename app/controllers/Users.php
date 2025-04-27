<?php
class Users extends Controller
{
    public function __construct() {

    }

    public function index() {
        if (!isLoggedIn()) {
            redirect('users/login');
        } else {
            $this->profile(); //Redirect to profile if logged in
        }
    }

    public function register() {
        $data = [
            'css' => ['users/register.css'],
            'title' => 'Register'
        ];
        
        $this->view('users/register', $data);
    
    }

    public function login() {
        $data = [
            'css' => ['users/login.css'],
            'title' => 'Login'
        ];
        
        $this->view('users/login', $data);
    }

    public function logout() {
        $data = [
            'title' => 'Logout'
        ];
        
        $this->view('users/logout', $data);
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