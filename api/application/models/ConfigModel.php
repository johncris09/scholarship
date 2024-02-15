<?php

defined('BASEPATH') or exit('No direct script access allowed');

class ConfigModel extends CI_Model
{

    public $table = 'config';


    public function get_all()
    {
        $query = $this->db->get($this->table);
        return $query->result();
    }
 



    public function update($id, $data)
	{ 
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}



	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}

}