<?php
class Student 
{
    private $db;

    public function __construct() {
        $this->db = new Database;
    }

    public function register($data) {
        //Query to insert a new user
        $this->db->query('INSERT INTO students (name, email, password) VALUES (:name, :email, :password)');

        $this->db->bind(':name', $data['name']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':password', password_hash($data['password'], PASSWORD_DEFAULT));

        //Execute
        if ($this->db->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function login($email, $password) {
        //Get user by email
        $this->db->query('SELECT * FROM students WHERE email = :email');
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
        $this->db->query('SELECT * FROM users WHERE id = :id');

        $this->db->bind(':id', $id);

        return $this->db->single();
    }

    public function findUserByEmail($email) {
        //Query to check if user with email exists
        $this->db->query('SELECT * FROM users WHERE email = :email');
        $this->db->bind(':email', $email);

        $this->db->single(); 

        //Check row
        if($this->db->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }
}