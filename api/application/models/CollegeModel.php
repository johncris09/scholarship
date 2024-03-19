<?php

defined('BASEPATH') or exit ('No direct script access allowed');

class CollegeModel extends CI_Model
{


	public $table = 'college';

	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}

	public function get_by_status($data)
	{

		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->row();
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->row();

		$this->db
			->select('
				c.id,
				scholarship.reference_number,
				c.scholarship_id,
                scholarship.lastname,
                scholarship.firstname,
                scholarship.middlename,
                scholarship.suffix,
                scholarship.photo,
                scholarship.contact_number,
                barangay.barangay AS address,
                scholarship.sex,
				c.app_year_number,
				c.app_id_number,
				c.app_sem_number,
				c.ctc,
				c.availment,
				cs.school,
				course.course,
				c.unit,
				c.year_level,
				c.semester,
				c.school_year,
				c.app_status,
                c.reason,
                barangay.id AS barangay_id,
                cs.id AS college_school_id,
                course.id AS course_id')
			->from('college c')
			->join('scholarship', 'c.scholarship_id = scholarship.id', 'LEFT')
			->join('barangay', 'scholarship.address = barangay.id', 'LEFT')
			->join('college_school cs', 'c.school = cs.id', 'LEFT')
			->join('course', 'c.course = course.id', 'LEFT')
			->where('c.semester', $query_sem->current_semester)
			->where('c.school_year', $query_sy->current_sy)
			->order_by('c.id', 'desc');


		if ($data['app_status'] == 'approved') {
			$this->db
				->like('c.app_status', 'approved', 'both')
				->where('c.app_status !=', 'disapproved');
		} else {
			$this->db->where($data);
		}

		$query = $this->db->get();
		return $query->result();

	}

	public function get_all_by_status($data)
	{

		$this->db
			->select('
				c.id,
				scholarship.reference_number,
				c.scholarship_id,
                scholarship.lastname,
                scholarship.firstname,
                scholarship.middlename,
                scholarship.suffix,
                scholarship.photo,
                scholarship.contact_number,
                barangay.barangay AS address,
                scholarship.sex,
				c.app_year_number,
				c.app_id_number,
				c.app_sem_number,
				c.ctc,
				c.availment,
				cs.school,
				course.course,
				c.unit,
				c.year_level,
				c.semester,
				c.school_year,
				c.app_status,
				c.reason,
                barangay.id AS barangay_id,
                cs.id AS college_school_id,
                course.id AS course_id')
			->from('college c')
			->join('scholarship', 'c.scholarship_id = scholarship.id', 'LEFT')
			->join('barangay', 'scholarship.address = barangay.id', 'LEFT')
			->join('college_school cs', 'c.school = cs.id', 'LEFT')
			->join('course', 'c.course = course.id', 'LEFT')
			->order_by('c.id', 'desc');


		if ($data['app_status'] == 'approved') {
			$this->db
				->like('c.app_status', 'approved', 'both')
				->where('c.app_status !=', 'disapproved');
		} else {
			$this->db->where($data);
		}

		$query = $this->db->get();
		return $query->result();
	}

	public function filter_by_status($data)
	{

		$this->db
			->select('
				c.id,
				scholarship.reference_number,
				c.scholarship_id,
                scholarship.lastname,
                scholarship.firstname,
                scholarship.middlename,
                scholarship.suffix,
                scholarship.photo,
                scholarship.contact_number,
                barangay.barangay AS address,
                scholarship.sex,
				c.app_year_number,
				c.app_id_number,
				c.app_sem_number,
				c.ctc,
				c.availment,
				cs.school,
				course.course,
				c.unit,
				c.year_level,
				c.semester,
				c.school_year,
				c.app_status,
				c.reason,
                barangay.id AS barangay_id,
                cs.id AS college_school_id,
                course.id AS course_id')
			->from('college c')
			->join('scholarship', 'c.scholarship_id = scholarship.id', 'LEFT')
			->join('barangay', 'scholarship.address = barangay.id', 'LEFT')
			->join('college_school cs', 'c.school = cs.id', 'LEFT')
			->join('course', 'c.course = course.id', 'LEFT')
			->order_by('c.id', 'desc');


		if ($data['app_status'] == 'approved') {
			$this->db
				->like('c.app_status', 'approved', 'both')
				->where('c.app_status !=', 'disapproved')
				->where('c.school_year', $data['school_year'])
				->where('c.semester', $data['semester']);
		} else {
			$this->db->where($data);
		}

		$query = $this->db->get();
		return $query->result();
	}


	public function bulk_status_update($data, $id)
	{
		$this->db->where_in('id', $id);
		return $this->db->update('college', $data);

	}



	public function total_pending()
	{
		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total_pending')
			->where('app_status', 'pending')
			->where('semester', $query_sem->current_semester)
			->where('school_year', $query_sy->current_sy)
			->get($this->table);

		return $query->result()[0];
	}


	public function total_approved()
	{


		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total_approved')
			->like('app_status', 'approved', 'both')
			->where('app_status !=', 'disapproved')
			->where('semester', $query_sem->current_semester)
			->where('school_year', $query_sy->current_sy)
			->get($this->table);

		return $query->result()[0];
	}


	public function total_disapproved()
	{
		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total_disapproved')
			->where('app_status', 'disapproved')
			->where('semester', $query_sem->current_semester)
			->where('school_year', $query_sy->current_sy)

			->get($this->table);

		return $query->result()[0];
	}
	public function total_archived()
	{

		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total_archived')
			->where('app_status  ', 'archived')
			->where('semester', $query_sem->current_semester)
			->where('school_year', $query_sy->current_sy)
			->get($this->table);

		return $query->result()[0];
	}




	public function total_void()
	{

		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total_void')
			->where('app_status  ', 'void')
			->where('semester', $query_sem->current_semester)
			->where('school_year', $query_sy->current_sy)
			->get($this->table);

		return $query->result()[0];
	}



	public function total()
	{

		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		$query = $this->db->select('count(*) as total')
			->where('semester', $query_sem->current_semester)
			->where('school_year', $query_sy->current_sy)
			->get($this->table);

		$result = $query->row();
		return $result->total;

	}

	public function get_status_by_barangay()
	{
		$query = $this->db->query("select * from barangay");
		$addresses = $query->result();

		$data = array();
		$query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
		$query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

		foreach ($addresses as $address) {


			$queryString = "
				SELECT
					COUNT(
						CASE WHEN c.app_status LIKE '%approved%' AND c.app_status != 'disapproved' AND s.address =  $address->id  THEN 1
					END
				) AS approved_count,
				COUNT(
					CASE WHEN c.app_status = 'Pending' AND s.address =  $address->id  THEN 1
				END
				) AS pending_count,
				COUNT(CASE WHEN c.app_status = 'Disapproved' AND s.address =  $address->id  THEN 1 END) as disapproved_count
				FROM
					`college` AS c,
					scholarship AS s
				WHERE
					c.scholarship_id = s.id AND c.semester = '$query_sem->current_semester' 
					AND c.school_year =  '$query_sy->current_sy' ";



			$query = $this->db->query($queryString);
			$result = $query->result();
			$data[] = array(
				'address' => $address->barangay,
				'approved' => $result[0]->approved_count,
				'pending' => $result[0]->pending_count,
				'disapproved' => $result[0]->disapproved_count,
			);
		}

		return $data;

	}


	public function filter_total_pending($data)
	{
		$query = $this->db->select('count(*) as total_pending')
			->where('app_status', 'pending')
			->where($data)
			->get($this->table);

		return $query->result()[0];
	}

	public function filter_total_approved($data)
	{
		$query = $this->db->select('count(*) as total_approved')
			->like('app_status', 'approved', 'both')
			->where('app_status !=', 'disapproved')
			->where($data)
			->get($this->table);

		return $query->result()[0];
	}


	public function filter_total_disapproved($data)
	{
		$query = $this->db->select('count(*) as total_disapproved')
			->where('app_status', 'disapproved')
			->where($data)
			->get($this->table);

		return $query->result()[0];
	}

	public function filter_total_archived($data)
	{

		$query = $this->db->select('count(*) as total_archived')
			->where('app_status  ', 'archived')
			->where($data)
			->get($this->table);

		return $query->result()[0];
	}
	public function filter_total_void($data)
	{

		$query = $this->db->select('count(*) as total_void')
			->where('app_status  ', 'void')
			->where($data)
			->get($this->table);

		return $query->result()[0];
	}

	public function filter_total($data)
	{

		$query = $this->db->select('count(*) as total')
			->where($data)
			->get($this->table);

		$result = $query->row();
		return $result->total;

	}


	public function filter_status_by_barangay($filter_data)
	{

		$query = $this->db->query("select * from barangay");
		$addresses = $query->result();

		$data = array();
		foreach ($addresses as $address) {

			$queryString = "
				SELECT
					COUNT(
						CASE WHEN c.app_status LIKE '%approved%' AND c.app_status != 'disapproved' AND s.address =  $address->id  THEN 1
					END
				) AS approved_count,
				COUNT(
					CASE WHEN c.app_status = 'Pending' AND s.address =  $address->id  THEN 1
				END
				) AS pending_count,
				COUNT(CASE WHEN c.app_status = 'Disapproved' AND s.address =  $address->id  THEN 1 END) as disapproved_count
				FROM
					`college` AS c,
					scholarship AS s
				WHERE
					c.scholarship_id = s.id  ";



			$queryString .= " and c.semester = '" . $filter_data['semester'] . "' 
					and c.school_year = '" . $filter_data['school_year'] . "'";

			$query = $this->db->query($queryString);
			$result = $query->result();
			$data[] = array(
				'address' => $address->barangay,
				'approved' => $result[0]->approved_count,
				'pending' => $result[0]->pending_count,
				'disapproved' => $result[0]->disapproved_count,
			);
		}

		return $data;

	}


	public function all_total_pending()
	{
		$query = $this->db->select('count(*) as total_pending')
			->where('app_status', 'pending')
			->get($this->table);

		return $query->result()[0];
	}


	public function all_total_approved()
	{
		$query = $this->db->select('count(*) as total_approved')
			->like('app_status', 'approved', 'both')
			->where('app_status !=', 'disapproved')
			->get($this->table);

		return $query->result()[0];
	}

	public function all_total_disapproved()
	{
		$query = $this->db->select('count(*) as total_disapproved')
			->where('app_status', 'disapproved')
			->get($this->table);

		return $query->result()[0];
	}



	public function all_total_archived()
	{
		$query = $this->db->select('count(*) as total_archived')
			->where('app_status', 'archived')
			->get($this->table);

		return $query->result()[0];
	}


	public function all_total_void()
	{
		$query = $this->db->select('count(*) as total_void')
			->where('app_status', 'void')
			->get($this->table);

		return $query->result()[0];
	}




	public function all_total()
	{

		$query = $this->db->select('count(*) as total')
			->get($this->table);

		$result = $query->row();
		return $result->total;

	}







	public function all_status_by_barangay()
	{

		$query = $this->db->query("select * from barangay");
		$addresses = $query->result();

		$data = array();
		foreach ($addresses as $address) {

			$queryString = "
				SELECT
					COUNT(
						CASE WHEN c.app_status LIKE '%approved%' AND c.app_status != 'disapproved' AND s.address =  $address->id  THEN 1
					END
				) AS approved_count,
				COUNT(
					CASE WHEN c.app_status = 'Pending' AND s.address =  $address->id  THEN 1
				END
				) AS pending_count,
				COUNT(CASE WHEN c.app_status = 'Disapproved' AND s.address =  $address->id  THEN 1 END) as disapproved_count
				FROM
					`college` AS c,
					scholarship AS s
				WHERE
					c.scholarship_id = s.id  ";

			$query = $this->db->query($queryString);
			$result = $query->result();
			$data[] = array(
				'address' => $address->barangay,
				'approved' => $result[0]->approved_count,
				'pending' => $result[0]->pending_count,
				'disapproved' => $result[0]->disapproved_count,
			);
		}

		return $data;

	}
	public function generate_report($data)
	{

		$this->db
			->select('
				c.id,
				scholarship.reference_number,
				c.scholarship_id,
                scholarship.lastname,
                scholarship.firstname,
                scholarship.middlename,
                scholarship.suffix,
                scholarship.photo,
                scholarship.contact_number,
                barangay.barangay AS address,
                scholarship.sex,
				c.app_year_number,
				c.app_id_number,
				c.app_sem_number,
				c.ctc,
				c.availment,
				cs.school,
				cs.abbreviation,
				cs.abbreviation,
				course.course,
				c.unit,
				c.year_level,
				c.semester,
				c.school_year,
				c.app_status, 
				c.reason,
                barangay.id AS barangay_id,
                cs.id AS college_school_id,
                course.id AS course_id')
			->from('college c')
			->join('scholarship', 'c.scholarship_id = scholarship.id', 'LEFT')
			->join('barangay', 'scholarship.address = barangay.id', 'LEFT')
			->join('college_school cs', 'c.school = cs.id', 'LEFT')
			->join('course', 'c.course = course.id', 'LEFT');


		if (!empty ($data)) {
			$this->db->where($data);
		}

		$this->db->order_by('lastname, firstname', 'asc');

		$query = $this->db->get();
		return $query->result();

	} 

}