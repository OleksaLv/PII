<?php
/*
 * App Core Class
 * Creates URL and loads core controller
 * URL FORMAT - /controller/method/params 
 */
class Core
{
    protected $currentController = 'Pages';
    protected $currentMethod = 'index';
    protected $params = [];

    public function __construct() {
        //print_r($this->getUrl());

        $url = $this->getUrl();
        
        //look in controllers for first value in url
        if(file_exists('../app/controllers/' . (isset($url[0]) ? ucwords($url[0]) : '') . '.php')) {
            //if exists, then set as controller
            $this->currentController = ucwords($url[0]);
            //unset 0 Index
            unset($url[0]); 
        }

        //require the controller
        require_once '../app/controllers/' . $this->currentController . '.php';

        //instantiate controller class
        $this->currentController = new $this->currentController;

        //Check for second value in url
        if(isset($url[1])) {
            //Check to see if mathod exists in controller
            if(method_exists($this->currentController, $url[1])) {
                $this->currentMethod = $url[1];
                unset($url[1]);
            }
        }

        //Get params as rest of url values
        $this->params = $url ? array_values($url) : [];

        //Call a callback with array of params
        call_user_func_array([$this->currentController, $this->currentMethod], $this->params);
    }

    public function getUrl() {
        if(isset($_GET['url'])) {
            $url = rtrim($_GET['url'], '/'); //remove last slash
            $url = filter_var($url, FILTER_SANITIZE_URL); //filter for symbols only for URL
            $url = explode('/', $url); //convert url to array (ex. posts/edit/1 => [posts, edit, 1]);
            return $url;
        }
    }
}
