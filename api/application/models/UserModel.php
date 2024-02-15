<?php

defined('BASEPATH') or exit('No direct script access allowed');

class UserModel extends CI_Model
{

	public $table = 'users';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$this->db->select('users.*, shs.school, shs.id as school_id');
		$this->db->from('users');
		$this->db->join('senior_high_school shs', 'users.school = shs.id', 'left');
		$this->db->order_by('users.id', 'desc');
		$query = $this->db->get();

		return $query->result();

	}
	public function get_online()
	{
		$this->db->select('users.*, shs.school, shs.id as school_id');
		$this->db->from('users');
		$this->db->join('senior_high_school shs', 'users.school = shs.id', 'left');
		// $this->db->where('users.isLogin', 1);
		$this->db->order_by('users.isLogin, users.lastname', 'desc');
		$query = $this->db->get(); 
		return $query->result();

	}

	public function login($data)
	{
		$this->db->select('*');
		$this->db->from($this->table);
		$this->db->where('username', $data['username']); // Fixed array key
		$query = $this->db->get();
		$result = $query->row();


		if ($result) {

			if (md5($data['password']) == $result->password) {
				return $result; // Passwords match
			}
		}

		return false;

	}


	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}

	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
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



}