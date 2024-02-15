<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Employee extends RestController
{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        $this->load->model('EmployeeModel');
    }
    public function index_get()
    {
        $employee = new EmployeeModel;
        $result = $employee->get_student();
        $this->response($result,  RestController::HTTP_OK);
    }
    public function insert_post()
    {
        $employee = new EmployeeModel;
        $data = array(
            'firstname' => $this->input->post('firstname'),
            'lastname' => $this->input->post('lastname'),
           
        ); 

        $result = $employee->insert($data);

        if($result > 0 ){  
            $this->response([
                'status' => true,
                'message'=> 'New Employee Created'
            ], RestController::HTTP_OK);
        } else{
                
            $this->response([
                'status' => false,
                'message'=> 'Failed to create Employee'
            ], RestController::HTTP_BAD_REQUEST);

        }
    }

    public function find_get($id)
    {
        $employee = new EmployeeModel;
        $result = $employee->find($id);

        $this->response($result, 200);

    }


    public function update_put($id)
    {
        $employee = new EmployeeModel;
        $data = array(
            'firstname' => $this->put('firstname'),
            'lastname' => $this->put('lastname'),
           
        ); 

        $update_result = $employee->update($id, $data);

        if($update_result > 0 ){  
            $this->response([
                'status' => true,
                'message'=> 'Employee Updated'
            ], RestController::HTTP_OK);
        } else{
                
            $this->response([
                'status' => false,
                'message'=> 'Failed to update Employee'
            ], RestController::HTTP_BAD_REQUEST);

        }
    }
 

    public function delete_delete($id)
    {
        $employee = new EmployeeModel;
        $result = $employee->delete($id);
        if($result > 0 ){  
            $this->response([
                'status' => true,
                'message'=> 'Employee Deleted'
            ], RestController::HTTP_OK);
        } else{
                
            $this->response([
                'status' => false,
                'message'=> 'Failed to delete Employee'
            ], RestController::HTTP_BAD_REQUEST);

        }

    }


}