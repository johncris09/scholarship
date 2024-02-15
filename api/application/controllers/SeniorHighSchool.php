<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class SeniorHighSchool extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('SeniorHighSchoolModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$model = new SeniorHighSchoolModel; 
		$result = $model->getAll(); 
		$this->response($result, RestController::HTTP_OK);
	} 


	public function insert_post()
	{

		$model = new SeniorHighSchoolModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
 
		$data = array(  
			'abbreviation' => $requestData['abbreviation'],
			'school' => $requestData['school_name'],
			'address' => $requestData['address'], 

		);

		$result = $model->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New Senior High School Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create senior high school.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$model = new SeniorHighSchoolModel;
		$result = $model->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$model = new SeniorHighSchoolModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'abbreviation' => $requestData['abbreviation'],
			'school' => $requestData['school_name'],
			'address' => $requestData['address'], 
		);


		$update_result = $model->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Senior High School Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update senior high school.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$model = new SeniorHighSchoolModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Senior High School Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete senior high school.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

	public function bulk_delete_delete()
	{

		$model = new SeniorHighSchoolModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		// Extract IDs
		// Object to array
		$ids = array_map(function ($item) {
			return $item['ID'];
		}, $requestData);

		// Convert IDs to integers
		$ids = array_map('intval', $ids);

		$result = $model->bulk_delete($ids);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Senior High School Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete senior high school.'
			], RestController::HTTP_BAD_REQUEST);

		}

	}

}