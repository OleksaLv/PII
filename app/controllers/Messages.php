<?php
class Messages extends Controller
{
    public function __construct() {

    }

    public function index() {
        $data = [
            'css' => ['messages/index.css'],
            'title' => 'Messages'
        ];
        
        $this->view('messages/index', $data);
    }
}