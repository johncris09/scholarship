<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Strand extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('StrandModel');  
	}
	public function index_get()
	{
		$strand = new StrandModel;
		$result = $strand->getAll();
		$this->response($result, RestController::HTTP_OK);
	}

	public function insert_post()
	{

		$strand = new StrandModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'Strand' => $requestData['strand'],

		);

		$result = $strand->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create strand.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$strand = new StrandModel;
		$result = $strand->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$strand = new StrandModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'Strand' => $requestData['strand'],

		);

		$update_result = $strand->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update Strand.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$strand = new StrandModel;
		$result = $strand->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete strand.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

}
