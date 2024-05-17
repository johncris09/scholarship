<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class RedFlag extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('RedFlagModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$redFlag = new RedFlagModel;
		$result = $redFlag->getAll();
		$this->response($result, RestController::HTTP_OK);
	}

	public function applicant_get($applicant_id)
	{

		$redFlag = new RedFlagModel;
		$result = $redFlag->getByApplicantID($applicant_id);
		$this->response($result, RestController::HTTP_OK);
	}




	public function insert_post()
	{

		$model = new RedFlagModel;
		$requestData = json_decode($this->input->raw_input_stream, true);
		$data = array(
			'scholarship_id' => $requestData['scholarshipId'],
			'note' => trim($requestData['note']),
		);
		$result = $model->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Inserted'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create red flag.'
			], RestController::HTTP_BAD_REQUEST);

		}


	}



	public function delete_delete($id)
	{
		$model = new RedFlagModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete red flag.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


}
