<?php
class Students extends Controller
{
    public function __construct() {

    }

    public function index($page = 1) {
        $totalPages = 4;

        //Validate page number
        if(is_int($page) && $page > $totalPages) {
            $page = $totalPages;
        } else if(!is_int($page) || $page < 0) {
            $page = 1;
        }
        
        $data = [
            'css' => ['students/index.css', 'students/student-modal.css'],
            'title' => 'Students',
            'page' => $page,
            'total_pages' => $totalPages
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