<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class TvetCourse extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('TvetCourseModel');
	}
	public function index_get()
	{
		$model = new TvetCourseModel;
		$result = $model->getAll();
		$this->response($result, RestController::HTTP_OK);
	}


	public function insert_post()
	{

		$model = new TvetCourseModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'course' => $requestData['course'],
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
				'message' => 'Failed to create course.'
			], RestController::HTTP_OK);

		}


	}



	public function find_get($id)
	{
		$model = new TvetCourseModel;
		$result = $model->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$model = new TvetCourseModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'course' => $requestData['course'],

		);

		$update_result = $model->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update Course.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$model = new TvetCourseModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Course Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


}
