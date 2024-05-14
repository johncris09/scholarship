<?php

defined('BASEPATH') or exit('No direct script access allowed');

class RedFlagModel extends CI_Model
{

	public $table = 'red_flag';

	public function getAll()
	{
		$query = $this->db
			->order_by('date_added', 'desc')
			->get($this->table);
		return $query->result();
	}

	

	public function getByApplicantID($scholarship_id)
	{
		$query = $this->db
			->where('scholarship_id', $scholarship_id)
			->order_by('date_added', 'desc')
			->get($this->table);
		return $query->result();
	}


	public function insert($data)
	{

		return $this->db->insert($this->table, $data);
	}
 

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}
	 

}
