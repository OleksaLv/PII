<?php
class Student 
{
    private $db;

    public function __construct() {
        $this->db = new Database;
    }

    public function getStudents($offset = 0, $limit = 4) {
        // Query to fetch students with group names using a JOIN
        $this->db->query('
            SELECT students.*, groups.name AS group_name 
            FROM students 
            LEFT JOIN groups ON students.group_id = groups.id 
            ORDER BY students.id 
            LIMIT :offset, :limit
        ');
    
        $this->db->bind(':offset', $offset, PDO::PARAM_INT);
        $this->db->bind(':limit', $limit, PDO::PARAM_INT);
    
        $students = $this->db->resultSet();
        return $students;
    }

    public function getStudentById($id) {
        //Query to fetch a single student by ID
        $this->db->query('SELECT * FROM students WHERE id = :id');
        $this->db->bind(':id', $id, PDO::PARAM_INT);
    
        $student = $this->db->single();
        return $student;
    }

    public function getStudentCount() {
        $this->db->query('SELECT COUNT(*) as total FROM students');
        
        $result = $this->db->single();
        return $result->total;
    }

    public function addStudent($data) {
        // Check if email already exists
        if ($this->findUserByEmail($data['email'])) {
            return false;
        }
        
        //Query to insert a new student
        $this->db->query('INSERT INTO students (first_name, last_name, group_id, gender,
                        birthday, email, password) VALUES (:first_name, :last_name,
                        :group_id, :gender, :birthday, :email, :password)');

        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':group_id', $data['group_id']);
        $this->db->bind(':gender', $data['gender']);
        $this->db->bind(':birthday', $data['birthday']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':password', $data['password']);

        //Execute
        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function updateStudent($data, $id) {
        // Query to update a student
        $this->db->query('UPDATE students SET first_name = :first_name, 
                        last_name = :last_name, group_id = :group_id, gender = :gender,
                        birthday = :birthday WHERE id = :id');
    
        $this->db->bind(':id', $id);
        $this->db->bind(':first_name', $data['first_name']);
        $this->db->bind(':last_name', $data['last_name']);
        $this->db->bind(':group_id', $data['group_id']);
        $this->db->bind(':gender', $data['gender']);
        $this->db->bind(':birthday', $data['birthday']);
    
        // Execute
        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteStudent($id) {
        //Query to delete a student
        $this->db->query('DELETE FROM students WHERE id = :id');
        $this->db->bind(':id', $id);

        //Execute
        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function findUserByEmail($email) {
        //Query to check if user with email exists
        $this->db->query('SELECT * FROM students WHERE email = :email');
        $this->db->bind(':email', $email);

        $this->db->single(); 

        //Check row
        if($this->db->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function getGroups() {
        //Query to fetch all groups
        $this->db->query('SELECT * FROM groups');
        
        $groups = $this->db->resultSet();
        return $groups;
    }
}