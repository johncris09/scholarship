<?php

defined('BASEPATH') or exit('No direct script access allowed');

class TvetSchoolModel extends CI_Model
{

	public $table = 'tvet_school';

	public function getAll()
	{


		$query = "  
				SELECT
				t.*,
				b.barangay AS address,
				b.id AS address_id
			FROM
				`tvet_school` t
			left join barangay  b on  t.address = b.id 
			ORDER BY
				t.school ASC;
			";

		$query = $this->db->query($query);
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



}