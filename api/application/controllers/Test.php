<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Test extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('TestModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{ 

		$test = new TestModel; 
		$CryptoHelper = new CryptoHelper;
		$result = $test->get_active() ;
		$this->response($result, RestController::HTTP_OK);
	}
 

	public function get_all_get()
	{
		$test = new TestModel;
		$result = $test->get_all();
		$this->response($result, RestController::HTTP_OK);
	}
	public function insert_post()
	{

		$test = new TestModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'user_id' => $requestData['user_id'],
			'group' => $requestData['group'],
			'created_at' => $requestData['created_at'],

		);

		$result = $test->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New Group Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create group.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$test = new TestModel;
		$result = $test->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$test = new TestModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'user_id' => $requestData['user_id'],
			'group' => $requestData['group'],
			'created_at' => $requestData['created_at'],

		);

		$update_result = $test->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Group Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update group.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$test = new TestModel;
		$result = $test->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Test Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete test.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

	public function bulk_delete_delete()
	{

		$test = new TestModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		// Extract IDs
		// Object to array
		$ids = array_map(function ($item) {
			return $item['ID'];
		}, $requestData);

		// Convert IDs to integers
		$ids = array_map('intval', $ids);

		$result = $test->bulk_delete($ids);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Group Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete group.'
			], RestController::HTTP_BAD_REQUEST);

		}

	}

}