<?php
class Students extends Controller
{
    private $postModel;
    public function __construct() {

    }

    public function index() {
        $data = [
            'css' => ['students/index.css', 'students/student-modal.css'],
            'title' => 'Studnet'
        ];
        
        $this->view('students/index', $data);
    }
}