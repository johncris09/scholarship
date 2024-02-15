<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Config extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('ConfigModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$config = new ConfigModel;
		$CryptoHelper = new CryptoHelper;
		$result =  $config->get_all();
		$this->response($result, RestController::HTTP_OK);
	}
	public function shs_appno_get()
	{
		$config = new ConfigModel;
		$CryptoHelper = new CryptoHelper;
		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($config->shs_appno()));
		$result = $config->shs_appno();
		$this->response($result, RestController::HTTP_OK);
	}

	public function college_appno_get()
	{
		$config = new ConfigModel;
		$CryptoHelper = new CryptoHelper;
		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($config->college_appno()));
		$result = $config->college_appno();
		$this->response($result, RestController::HTTP_OK);
	}


	public function tvet_appno_get()
	{
		$config = new ConfigModel;
		$CryptoHelper = new CryptoHelper;
		// $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($config->tvet_appno()));
		$result = $config->tvet_appno();
		$this->response($result, RestController::HTTP_OK);
	}



	public function find_get($id)
	{
		$config = new ConfigModel;
		$CryptoHelper = new CryptoHelper;
		$result = $config->find($id) ;
		$this->response($result, RestController::HTTP_OK);

	}




	public function update_put($id)
	{


		$config = new ConfigModel;

		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'current_sy' => $requestData['current_sy'],
			'current_semester' => $requestData['current_semester'],

		);

		$update_result = $config->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'SUccessfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



}