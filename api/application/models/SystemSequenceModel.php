<?php

defined('BASEPATH') or exit('No direct script access allowed');

class SystemSequenceModel extends CI_Model
{

    public $table = 'sys_sequence';


    public function get_all()
    {
        $query = $this->db->get($this->table);
        return $query->result();
    }

    public function shs_appno()
    {
        $query = $this->db->where('id', 1)
            ->get($this->table);
        return $query->result()[0];
    }

    public function college_appno()
    {
        $query = $this->db->where('id', 2)
            ->get($this->table);
        return $query->result()[0];
    }

    public function tvet_appno()
    {
        $query = $this->db->where('id', 3)
            ->get($this->table);
        return $query->result()[0];
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

    function getLatestAppNumber($data){ 
        $query = $this->db->where($data)
        ->get($this->table);
    return $query->row();
    }

}