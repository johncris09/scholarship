<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class EmployeeModel extends CI_Model{
    public function get_employee(){
        $query = $this->db->get('employee');
        return $query->result();
    }

    public function get_student(){
        $query = $this->db->get('table_scholarregistration');
        return $query->result();
    }

    public function insert($data){
        return $this->db->insert( 'employee', $data);
    }

    public function find($id){
        $this->db->where('id', $id);
        $query = $this->db->get('employee');
        return $query->row();
    }

    public function update($id, $data){
        $this->db->where('id', $id);
        return $this->db->update( 'employee', $data);
    }
    public function delete($id){
        return $this->db->delete('employee', ['id'=> $id]);  
    }
}