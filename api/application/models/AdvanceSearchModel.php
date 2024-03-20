<?php

defined('BASEPATH') or exit ('No direct script access allowed');

class AdvanceSearchModel extends CI_Model
{

    public function search($searchValue)
    {


        $this->db->select('scholarship.*,  barangay.id as barangay_id, barangay.barangay as address');
        $this->db->from('scholarship');

        $this->db->like('reference_number', $searchValue);
        $this->db->or_like('firstname', $searchValue);
        $this->db->or_like('lastname', $searchValue);
        $this->db->or_like('middlename', $searchValue);
        $this->db->or_like('suffix', $searchValue);
        // $this->db->or_like('address', $searchValue);
        // $this->db->or_like('birthdate', $searchValue);
        // $this->db->or_like('civil_status', $searchValue);
        // $this->db->or_like('sex', $searchValue);
        // $this->db->or_like('contact_number', $searchValue);
        // $this->db->or_like('email_address', $searchValue);
        // $this->db->or_like('father_name', $searchValue);
        // $this->db->or_like('father_occupation', $searchValue);
        // $this->db->or_like('mother_name', $searchValue);
        // $this->db->or_like('mother_occupation', $searchValue);
        $this->db->or_like("CONCAT(firstname, ' ', lastname, ' ', middlename, ' ', suffix)", $searchValue);
        $this->db->or_like("CONCAT(lastname, ', ', firstname, ' ', middlename, ' ', suffix)", $searchValue);
        $this->db->join('barangay', 'scholarship.address = barangay.id');
 
        $query = $this->db->get();

        return $query->result();
    }

}