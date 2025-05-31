<?php
class User 
{
    private $db;

    public function __construct() {
        $this->db = new Database;
    }

    public function register($data) {
        //Query to insert a new user
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

    public function login($email, $password) {
        //Get user by email
        $this->db->query('
            SELECT students.*, groups.name AS group_name 
            FROM students 
            LEFT JOIN groups ON students.group_id = groups.id 
            WHERE students.email = :email
        ');
        $this->db->bind(':email', $email);

        $row = $this->db->single(); 

        //Check row
        if($this->db->rowCount() > 0) {
            //Verify password
            if(password_verify($password, $row->password)) {
                return $row;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function getUserById($id) {
        //Query to check if user with email exists
        $this->db->query('
            SELECT students.*, groups.name AS group_name 
            FROM students 
            LEFT JOIN groups ON students.group_id = groups.id 
            WHERE students.id = :id
        ');
        
        $this->db->bind(':id', $id);

        return $this->db->single();
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