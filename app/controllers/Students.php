<?php
class Students extends Controller
{
    private $studentModel;
    private $userModel;

    public function __construct() {
        if(!isLoggedIn()) {
            redirect('users/login');
        }

        $this->studentModel = $this->model('Student');
        $this->userModel = $this->model('User');
    }

    public function index($page = 1) {
        $limit = 4; //Number of students per page
        $totalStudents = $this->studentModel->getStudentCount();
        $totalPages = ceil($totalStudents / $limit);
    
        //Validate page number
        if ($page > $totalPages) {
            $page = $totalPages;
        } elseif ($page < 1) {
            $page = 1;
        }
    
        //Calculate offset
        $offset = ($page - 1) * $limit;
    
        //Get students for the current page
        $students = $this->studentModel->getStudents($offset, $limit);
    
        $data = [
            'css' => ['students/index.css', 'students/student-modal.css'],
            'title' => 'Students',
            'page' => $page,
            'total_pages' => $totalPages,
            'students' => $students
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

    public function add() {
        //Check for POST
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            //Process form data
            $data = [
                'group_id' => trim($_POST['modal-group'] ?? ''),
                'name' => trim(($_POST['modal-first-name'] ?? '') . ' ' . ($_POST['modal-last-name'] ?? '')),
                'first_name' => trim($_POST['modal-first-name'] ?? ''),
                'last_name' => trim($_POST['modal-last-name'] ?? ''),
                'gender' => strtolower(trim($_POST['modal-gender'] ?? '')),
                'birthday' => trim($_POST['modal-birthday'] ?? ''),
                'group_id_err' => '',
                'name_err' => '',
                'gender_err' => '',
                'birthday_err' => ''
            ];
    
            //Validate group
            if (empty($data['group_id'])) {
                $data['group_id_err'] = 'Please select a group';
            }
    
            //Validate name
            if (empty($data['first_name']) || empty($data['last_name'])) {
                $data['name_err'] = 'Please enter a full name';
            }
    
            //Validate gender
            if (empty($data['gender'])) {
                $data['gender_err'] = 'Please select gender';
            }
    
            //Validate birthday
            if (empty($data['birthday'])) {
                $data['birthday_err'] = 'Please enter birthday';
            }
    
            //Make sure no errors
            if (empty($data['group_id_err']) && empty($data['name_err']) && 
                empty($data['gender_err']) && empty($data['birthday_err'])) {
                
                //Add student to database
                if ($this->studentModel->addStudent($data)) {
                    //Set flash message
                    flash('student_message', 'Student added successfully');
                    //Redirect to students page
                    redirect('students');
                } else {
                    die('Something went wrong');
                }
            } else {
                //Get the groups for the dropdown
                $groups = $this->studentModel->getGroups();
                
                $page = 1;
                $limit = 4;
                $totalStudents = $this->studentModel->getStudentCount();
                $totalPages = ceil($totalStudents / $limit);
                $offset = ($page - 1) * $limit;
                $students = $this->studentModel->getStudents($offset, $limit);
    
                //Prepare data for the view
                $viewData = [
                    'css' => ['students/index.css', 'students/student-modal.css'],
                    'title' => 'Students',
                    'students' => $students,
                    'groups' => $groups,
                    'page' => $page,
                    'total_pages' => $totalPages,
                    'modal_window' => 'add',
                    // Form data
                    'group_id' => $data['group_id'],
                    'name' => $data['name'],
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'gender' => $data['gender'],
                    'birthday' => $data['birthday'],
                    // Error messages
                    'group_id_err' => $data['group_id_err'],
                    'name_err' => $data['name_err'],
                    'gender_err' => $data['gender_err'],
                    'birthday_err' => $data['birthday_err']
                ];
                
                $this->view('students/index', $viewData);
            }
        } else {
            //It's a GET request - show the form
            
            //Get the groups for the dropdown
            $groups = $this->studentModel->getGroups();
            
            $page = 1;
            $limit = 4;
            $totalStudents = $this->studentModel->getStudentCount();
            $totalPages = ceil($totalStudents / $limit);
            $offset = ($page - 1) * $limit;
            $students = $this->studentModel->getStudents($offset, $limit);
    
            //Prepare data for the view
            $data = [
                'css' => ['students/index.css', 'students/student-modal.css'],
                'title' => 'Students',
                'students' => $students,
                'groups' => $groups,
                'page' => $page,
                'total_pages' => $totalPages,
                'modal_window' => 'add',
                // Initialize form data with empty values
                'group_id' => '',
                'name' => '',
                'first_name' => '',
                'last_name' => '',
                'gender' => '',
                'birthday' => '',
                // Initialize error messages
                'group_id_err' => '',
                'name_err' => '',
                'gender_err' => '',
                'birthday_err' => ''
            ];
            
            $this->view('students/index', $data);
        }
    }

    public function edit($id) {
        //Check for POST
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            //Process form data
            $data = [
                'id' => $id,
                'group_id' => trim($_POST['modal-group'] ?? ''),
                'name' => trim(($_POST['modal-first-name'] ?? '') . ' ' . ($_POST['modal-last-name'] ?? '')),
                'first_name' => trim($_POST['modal-first-name'] ?? ''),
                'last_name' => trim($_POST['modal-last-name'] ?? ''),
                'gender' => strtolower(trim($_POST['modal-gender'] ?? '')),
                'birthday' => trim($_POST['modal-birthday'] ?? ''),
                'group_id_err' => '',
                'name_err' => '',
                'gender_err' => '',
                'birthday_err' => ''
            ];
    
            //Validate group
            if (empty($data['group_id'])) {
                $data['group_id_err'] = 'Please select a group';
            }
    
            //Validate name
            if (empty($data['first_name']) || empty($data['last_name'])) {
                $data['name_err'] = 'Please enter a full name';
            }
    
            //Validate gender
            if (empty($data['gender'])) {
                $data['gender_err'] = 'Please select gender';
            }
    
            //Validate birthday
            if (empty($data['birthday'])) {
                $data['birthday_err'] = 'Please enter birthday';
            }
    
            //Make sure no errors
            if (empty($data['group_id_err']) && empty($data['name_err']) && 
                empty($data['gender_err']) && empty($data['birthday_err'])) {
                
                // Get current student data to check if anything changed
                $currentStudent = $this->studentModel->getStudentById($id);
                
                // Check if any data has changed
                if (
                    $currentStudent->group_id != $data['group_id'] ||
                    $currentStudent->name != $data['name'] ||
                    $currentStudent->gender != $data['gender'] ||
                    $currentStudent->birthday != $data['birthday']
                ) {
                    //Update student in database
                    if ($this->studentModel->updateStudent($data, $id)) {
                        //Set flash message
                        flash('student_message', 'Student updated successfully');
                        //Redirect to students page
                        redirect('students');
                    } else {
                        die('Something went wrong');
                    }
                } else {
                    // No changes were made, just redirect back without updating
                    redirect('students');
                }
            } else {
                //Get the groups for the dropdown
                $groups = $this->studentModel->getGroups();
                
                $page = 1;
                $limit = 4;
                $totalStudents = $this->studentModel->getStudentCount();
                $totalPages = ceil($totalStudents / $limit);
                $offset = ($page - 1) * $limit;
                $students = $this->studentModel->getStudents($offset, $limit);
    
                //Prepare data for the view
                $viewData = [
                    'css' => ['students/index.css', 'students/student-modal.css'],
                    'title' => 'Students',
                    'students' => $students,
                    'groups' => $groups,
                    'page' => $page,
                    'total_pages' => $totalPages,
                    'modal_window' => 'edit',
                    'student_id' => $id,
                    //Form data
                    'group_id' => $data['group_id'],
                    'name' => $data['name'],
                    'first_name' => $data['first_name'],
                    'last_name' => $data['last_name'],
                    'gender' => $data['gender'],
                    'birthday' => $data['birthday'],
                    //Error messages
                    'group_id_err' => $data['group_id_err'],
                    'name_err' => $data['name_err'],
                    'gender_err' => $data['gender_err'],
                    'birthday_err' => $data['birthday_err']
                ];
                
                $this->view('students/index', $viewData);
            }
        } else {
            //It's a GET request - show the form with student data
            
            //Get student
            $student = $this->studentModel->getStudentById($id);
            
            //Check if student exists
            if (!$student) {
                redirect('students');
            }
            
            //Split name into first and last name
            $nameParts = explode(' ', $student->name, 2);
            $firstName = $nameParts[0] ?? '';
            $lastName = $nameParts[1] ?? '';
            
            //Get the groups for the dropdown
            $groups = $this->studentModel->getGroups();
            
            $page = 1;
            $limit = 4;
            $totalStudents = $this->studentModel->getStudentCount();
            $totalPages = ceil($totalStudents / $limit);
            $offset = ($page - 1) * $limit;
            $students = $this->studentModel->getStudents($offset, $limit);
    
            //Prepare data for the view
            $data = [
                'css' => ['students/index.css', 'students/student-modal.css'],
                'title' => 'Students',
                'students' => $students,
                'groups' => $groups,
                'page' => $page,
                'total_pages' => $totalPages,
                'modal_window' => 'edit',
                'student_id' => $id,
                //Form data with student information
                'group_id' => $student->group_id,
                'name' => $student->name,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'gender' => $student->gender,
                'birthday' => $student->birthday,
                //Initialize error messages
                'group_id_err' => '',
                'name_err' => '',
                'gender_err' => '',
                'birthday_err' => ''
            ];
            
            $this->view('students/index', $data);
        }
    }
    
    public function delete($id = null) {
        // Check for POST request
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Check if we have student IDs to delete
            if (empty($id) && empty($_POST['student_ids'])) {
                flash('student_message', 'No students selected for deletion', 'alert alert-danger');
                redirect('students');
            }
            
            // Get student IDs from either URL parameter or POST data
            $studentIds = [];
            if (!empty($id)) {
                // Handle ID format like "1_2_3" - using underscore as separator
                $studentIds = explode('_', $id);
            } elseif (!empty($_POST['student_ids'])) {
                // Handle comma-separated IDs from form input
                $studentIds = explode(',', $_POST['student_ids']);
            }
            
            // Validate that IDs exist
            $studentIds = array_filter($studentIds, function($id) {
                return is_numeric($id) && $id > 0;
            });
            
            if (empty($studentIds)) {
                flash('student_message', 'Invalid student selection', 'alert alert-danger');
                redirect('students');
            }
            
            // Track success/failure
            $successCount = 0;
            $failCount = 0;
            
            // Process each student ID
            foreach ($studentIds as $studentId) {
                // Get the student to confirm they exist
                $student = $this->studentModel->getStudentById($studentId);
                
                if (!$student) {
                    $failCount++;
                    continue; // Skip this ID and move to next
                }
                
                // Delete the student
                if ($this->studentModel->deleteStudent($studentId)) {
                    $successCount++;
                } else {
                    $failCount++;
                }
            }
            
            // Set appropriate flash message
            if ($successCount > 0) {
                if ($failCount > 0) {
                    flash('student_message', "Deleted $successCount students. Failed to delete $failCount students.", 'alert alert-warning');
                } else {
                    if ($successCount == 1) {
                        flash('student_message', 'Student deleted successfully');
                    } else {
                        flash('student_message', "$successCount students deleted successfully");
                    }
                }
            } else {
                flash('student_message', 'Failed to delete students', 'alert alert-danger');
            }
            
            redirect('students');
        } else {
            // If it's a GET request, show the confirmation modal
            
            // If no ID specified, redirect to students page
            if (!$id) {
                redirect('students');
            }
            
            // Parse the IDs for display in the modal
            $studentIds = explode('+', $id);
            $studentCount = count($studentIds);
            
            // For multiple students, we don't need to verify each one for the confirmation
            // We just need to know how many will be affected
            
            // For a single student, get details for confirmation
            $studentName = '';
            if ($studentCount == 1) {
                $student = $this->studentModel->getStudentById($studentIds[0]);
                if (!$student) {
                    redirect('students');
                }
                $studentName = $student->name;
            }
            
            // Get students for table
            $page = 1;
            $limit = 4;
            $totalStudents = $this->studentModel->getStudentCount();
            $totalPages = ceil($totalStudents / $limit);
            $offset = ($page - 1) * $limit;
            $students = $this->studentModel->getStudents($offset, $limit);
            
            $data = [
                'css' => ['students/index.css', 'students/student-modal.css'],
                'title' => 'Students',
                'students' => $students,
                'page' => $page,
                'total_pages' => $totalPages,
                'modal_window' => 'delete',
                'student_id' => $id,
                'student_count' => $studentCount,
                'student_name' => $studentName
            ];
            
            $this->view('students/index', $data);
        }
    }
}