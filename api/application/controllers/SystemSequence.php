<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class SystemSequence extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('SystemSequenceModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$system_sequence = new SystemSequenceModel;
		$CryptoHelper = new CryptoHelper;
		$result = $system_sequence->get_all();
		$this->response($result, RestController::HTTP_OK);
	}
	public function shs_appno_get()
	{
		$system_sequence = new SystemSequenceModel;
		$CryptoHelper = new CryptoHelper;
		// $result = $system_sequence->shs_appno();
		$result = $system_sequence->shs_appno();
		$this->response($result, RestController::HTTP_OK);
	}

	public function college_appno_get()
	{
		$system_sequence = new SystemSequenceModel;
		$CryptoHelper = new CryptoHelper;
		// $result = $system_sequence->college_appno();
		$result = $system_sequence->college_appno();
		$this->response($result, RestController::HTTP_OK);
	}


	public function tvet_appno_get()
	{
		$system_sequence = new SystemSequenceModel;
		$CryptoHelper = new CryptoHelper;
		// $result = $system_sequence->tvet_appno();
		$result = $system_sequence->tvet_appno();
		$this->response($result, RestController::HTTP_OK);
	}



	public function find_get($id)
	{
		$system_sequence = new SystemSequenceModel;
		$CryptoHelper = new CryptoHelper;
		$result =  $system_sequence->find($id) ;
		$this->response($result, RestController::HTTP_OK);

	}




	public function update_put($id)
	{


		$system_sequence = new SystemSequenceModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'seq_name' => $requestData['seq_name'],
			'seq_year' => $requestData['seq_year'],
			'seq_sem' => $requestData['seq_sem'],
			'seq_appno' => $requestData['seq_appno'],

		);

		$update_result = $system_sequence->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



}