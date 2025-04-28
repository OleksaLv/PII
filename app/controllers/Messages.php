<?php
class Messages extends Controller
{
    private $messageModel;
    private $userModel;

    public function __construct() {
        if(!isLoggedIn()) {
            redirect('users/login');
        }

        $this->messageModel = $this->model('Message');
        $this->userModel = $this->model('User');
    }

    public function index() {
        $data = [
            'css' => ['messages/index.css'],
            'title' => 'Messages'
        ];
        
        $this->view('messages/index', $data);
    }
}