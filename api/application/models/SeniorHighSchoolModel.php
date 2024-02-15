<?php

defined('BASEPATH') or exit('No direct script access allowed');

class SeniorHighSchoolModel extends CI_Model
{

	public $table = 'senior_high_school';

	public function getAll()
	{

        $query = "  
			SELECT
				s.*,
				b.barangay as address,
				b.id as address_id
			FROM
				`senior_high_school` s
			left join  barangay as b on  s.address = b.id
			 
			ORDER by s.school asc;
			"; 

		$query = $this->db->query($query );
		return $query->result(); 
	}

 


	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}

	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}


	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}


	public function bulk_delete($data)
	{
		$this->db->where_in('id', $data);
		return $this->db->delete($this->table);
	}

 
	public function findByschoolName($school)
	{
		$query = $this->db
			->where('abbreviation', $school)
			->get($this->table);
		return $query->row();
	}

}