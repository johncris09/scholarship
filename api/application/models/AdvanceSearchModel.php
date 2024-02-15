<?php

defined('BASEPATH') or exit('No direct script access allowed');

class AdvanceSearchModel extends CI_Model
{

    public function search($searchValue)
    {

        $this->db->select('*');
        $this->db->from('scholarship');

        $this->db->like('reference_number', $searchValue);
        $this->db->or_like('firstname', $searchValue);
        $this->db->or_like('lastname', $searchValue);
        $this->db->or_like('middlename', $searchValue);
        $this->db->or_like('suffix', $searchValue);
        $this->db->or_like('address', $searchValue);
        $this->db->or_like('birthdate', $searchValue);
        $this->db->or_like('civil_status', $searchValue);
        $this->db->or_like('sex', $searchValue);
        $this->db->or_like('contact_number', $searchValue);
        $this->db->or_like('email_address', $searchValue);
        $this->db->or_like('father_name', $searchValue);
        $this->db->or_like('father_occupation', $searchValue);
        $this->db->or_like('mother_name', $searchValue);
        $this->db->or_like('mother_occupation', $searchValue);
        $this->db->or_like("CONCAT(firstname, ' ', lastname, ' ', middlename)", $searchValue);
        $this->db->or_like("CONCAT(lastname, ', ', firstname, ' ', middlename)", $searchValue);



        $query = $this->db->get();

        return $query->result();
    }


}