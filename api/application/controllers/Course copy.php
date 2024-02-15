<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Course extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('CourseModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$course = new CourseModel;
		$CryptoHelper = new CryptoHelper; 
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($course->get_active_course()));
		$this->response($result, RestController::HTTP_OK);
	}


	public function get_all_get()
	{
		$course = new CourseModel;
		$CryptoHelper = new CryptoHelper; 
		$result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($course->get_all_course()));
		$this->response($result, RestController::HTTP_OK);
	}
	public function insert_post()
	{

		$course = new CourseModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'colCourse' => $requestData['course'],
			'colManager' => $requestData['manager'],

		);

		$result = $course->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New Course Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create course.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$course = new CourseModel;
		$result = $course->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$course = new CourseModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'colCourse' => $requestData['course'],
			'colManager' => $requestData['manager'],

		);

		$update_result = $course->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Course Updated.'
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
		$course = new CourseModel;
		$result = $course->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Course Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete course.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}

	public function bulk_delete_delete()
	{

		$course = new CourseModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		// Extract IDs
		// Object to array
		$ids = array_map(function ($item) {
			return $item['ID'];
		}, $requestData);

		// Convert IDs to integers
		$ids = array_map('intval', $ids);

		$result = $course->bulk_delete($ids);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Course Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete course.'
			], RestController::HTTP_BAD_REQUEST);

		}

	}

}