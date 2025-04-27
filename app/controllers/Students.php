<?php
class Students extends Controller
{
    public function __construct() {

    }

    public function index() {
        $data = [
            'css' => ['students/index.css', 'students/student-modal.css'],
            'title' => 'Main'
        ];
        
        $this->view('students/index', $data);
    }

    public function dashboard() {
        $data = [
            'css' => ['students/dashboard.css'],
            'title' => 'Dashboard'
        ];
        
        $this->view('students/dashboard', $data);
    }

    public function tasks() {
        $data = [
            'css' => ['students/tasks.css'],
            'title' => 'Tasks'
        ];
        
        $this->view('students/tasks', $data);
    }
}