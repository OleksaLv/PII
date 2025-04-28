<?php
class Student 
{
    private $db;

    public function __construct() {
        $this->db = new Database;
    }

    public function getStudents($offset = 0, $limit = 4) {
        //Query to fetch students with pagination
        $this->db->query('SELECT * FROM students ORDER BY created_at LIMIT :offset, :limit');
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
        //Query to insert a new student
        $this->db->query('INSERT INTO students (name, group, gender, birthday) 
                        VALUES (:name, :group, :gender, :birthday)');

        $this->db->bind(':name', $data['name']);
        $this->db->bind(':group', $data['group']);
        $this->db->bind(':gender', $data['gender']);
        $this->db->bind(':birthday', $data['birthday']);

        //Execute
        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function updateStudent($id, $data) {
        //Query to update a student
        $this->db->query('UPDATE students SET name = :name, group = :group,
                        gender = :gender, birthday = :birthday WHERE id = :id');

        $this->db->bind(':id', $id);
        $this->db->bind(':name', $data['name']);
        $this->db->bind(':group', $data['group']);
        $this->db->bind(':gender', $data['gender']);
        $this->db->bind(':birthday', $data['birthday']);

        //Execute
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
}