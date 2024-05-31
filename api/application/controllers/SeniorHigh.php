<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class SeniorHigh extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('SeniorHighModel');
		$this->load->helper('crypto_helper');
		$this->load->model('SystemSequenceModel');
	}



	public function get_by_status_get()
	{
		$seniorhigh = new SeniorHighModel; 
		$data = array(
			'app_status' => $this->input->get('status'),
		);
		$result = $seniorhigh->get_by_status($data); // current status list 
		$this->response($result, RestController::HTTP_OK);
	}


	public function get_all_by_status_get()
	{

		$seniorhigh = new SeniorHighModel; 
		$data = array(
			'app_status' => $this->input->get('status'),
		);
		$result = $seniorhigh->get_all_by_status($data);

		$this->response($result, RestController::HTTP_OK);
	}

	public function filter_by_status_get()
	{
		$seniorhigh = new SeniorHighModel; 
		$data = array(
			'app_status' => $this->input->get('status'),
			'school_year' => $this->input->get('school_year'),
			'semester' => $this->input->get('semester'),
		);

		$result = $seniorhigh->filter_by_status($data);
		$this->response($result, RestController::HTTP_OK);
	}



	public function total_status_get()
	{
		$seniorhigh = new SeniorHighModel; 

		$requestData = $this->input->get();


		$seniorHighSchoolFilter = array(
			'school' => !empty($requestData['school']) ? $requestData['school'] : ''
		);

		$result = array(
			'type' => "Senior High",
			'pending' => (int) $seniorhigh->total_pending($seniorHighSchoolFilter)->total_pending,
			'approved' => (int) $seniorhigh->total_approved($seniorHighSchoolFilter)->total_approved,
			'disapproved' => (int) $seniorhigh->total_disapproved($seniorHighSchoolFilter)->total_disapproved,
			'archived' => (int) $seniorhigh->total_archived($seniorHighSchoolFilter)->total_archived,
			'void' => (int) $seniorhigh->total_void($seniorHighSchoolFilter)->total_void,
		);

		$this->response($result, RestController::HTTP_OK);
	}


	public function update_put($id)
	{


		$seniorhigh = new SeniorHighModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'app_year_number' => $requestData['app_year_number'],
			'app_id_number' => $requestData['app_id_number'],
			'app_sem_number' => $requestData['app_sem_number'],
			'availment' => $requestData['availment'],
			'school' => $requestData['school'],
			'strand' => $requestData['strand'],
			'grade_level' => $requestData['grade_level'],
			'semester' => $requestData['semester'],
			'school_year' => $requestData['school_year'],
			'app_status' => $requestData['app_status'],
			'reason' => json_encode($requestData['reason']),
		);

		$update_result = $seniorhigh->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Application Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update application.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}




	public function update_status_put($id)
	{
		$seniorhigh = new SeniorHighModel;

		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'app_status' => $requestData['status'],
		);

		$update_result = $seniorhigh->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Application Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update application.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function bulk_status_update_post()
	{

		$seniorhigh = new SeniorHighModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		// Extract IDs
		// Object to array
		$ids = array_map(function ($item) {
			return $item['id'];
		}, $requestData['data']);

		// Convert IDs to integers
		$ids = array_map('intval', $ids);
		$data = array(
			'app_status' => $requestData['status'],
		);

		if (isset($requestData['reason'])) {
			$data['reason'] = json_encode($requestData['reason']);
		}
		$result = $seniorhigh->bulk_status_update($data, $ids);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Application Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update application.'
			], RestController::HTTP_BAD_REQUEST);

		}

	}


	public function total_get()
	{
		$seniorhigh = new SeniorHighModel;
	 
		$requestData = $this->input->get();


		$seniorHighSchoolFilter = array(
			'school' => !empty($requestData['school']) ? $requestData['school'] : ''
		);

		$result = (int) $seniorhigh->total($seniorHighSchoolFilter);
		$this->response($result, RestController::HTTP_OK);
	}



	public function get_status_by_barangay_get()
	{
		$seniorhigh = new SeniorHighModel; 

		$requestData = $this->input->get();


		$seniorHighSchoolFilter = array(
			'school' => !empty($requestData['school']) ? $requestData['school'] : ''
		);
		$data = $seniorhigh->get_status_by_barangay($seniorHighSchoolFilter);


		// Initialize arrays for labels and datasets
		$labels = array();
		$datasets = array(
			array('label' => 'Approved', 'backgroundColor' => '#0dcaf0', 'borderColor' => '#0dcaf0', 'data' => array()),
			array('label' => 'Pending', 'backgroundColor' => '#ffc107', 'borderColor' => '#ffc107', 'data' => array()),
			array('label' => 'Disapproved', 'backgroundColor' => '#f87979', 'borderColor' => '#f87979', 'data' => array())
		);

		// Populate labels and datasets
		foreach ($data as $item) {
			$labels[] = $item['address'];
			$datasets[0]['data'][] = $item['approved'];
			$datasets[1]['data'][] = $item['pending'];
			$datasets[2]['data'][] = $item['disapproved'];
		}

		// Assemble the final result
		$result = array(
			'labels' => $labels,
			'datasets' => $datasets
		);

		$this->response($result, RestController::HTTP_OK);
	}




	public function filter_total_status_get()
	{
		$seniorhigh = new SeniorHighModel; 
		$requestData = $this->input->get();
		$data = array(
			'semester' => !empty($requestData['semester']) ? $requestData['semester'] : '',
			'school_year' => !empty($requestData['school_year']) ? $requestData['school_year'] : '',
		);
		$result = array(
			'type' => "Senior High",
			'pending' => (int) $seniorhigh->filter_total_pending($data)->total_pending,
			'approved' => (int) $seniorhigh->filter_total_approved($data)->total_approved,
			'disapproved' => (int) $seniorhigh->filter_total_disapproved($data)->total_disapproved,
			'archived' => (int) $seniorhigh->filter_total_archived($data)->total_archived,
			'void' => (int) $seniorhigh->filter_total_void($data)->total_void,
		);
		$this->response($result, RestController::HTTP_OK);
	}

	public function filter_total_get()
	{
		$seniorhigh = new SeniorHighModel; 
		$requestData = $this->input->get();
		$data = array(
			'semester' => !empty($requestData['semester']) ? $requestData['semester'] : '',
			'school_year' => !empty($requestData['school_year']) ? $requestData['school_year'] : '',
		);
		$result = $seniorhigh->filter_total($data);
		$this->response($result, RestController::HTTP_OK);
	}



	public function filter_status_by_barangay_get()
	{
		$seniorhigh = new SeniorHighModel; 

		$requestData = $this->input->get();

		$data = array(
			'semester' => $requestData['semester'],
			'school_year' => $requestData['school_year'],
		);
		$data = $seniorhigh->filter_status_by_barangay($data);

		// Initialize arrays for labels and datasets
		$labels = array();
		$datasets = array(
			array('label' => 'Approved', 'backgroundColor' => '#0dcaf0', 'data' => array()),
			array('label' => 'Pending', 'backgroundColor' => '#ffc107', 'data' => array()),
			array('label' => 'Disapproved', 'backgroundColor' => '#f87979', 'data' => array())
		);

		// Populate labels and datasets
		foreach ($data as $item) {
			$labels[] = $item['address'];
			$datasets[0]['data'][] = $item['approved'];
			$datasets[1]['data'][] = $item['pending'];
			$datasets[2]['data'][] = $item['disapproved'];
		}

		// Assemble the final result
		$result = array(
			'labels' => $labels,
			'datasets' => $datasets
		);

		$this->response($result, RestController::HTTP_OK);
	}


	public function all_total_status_get()
	{
		$seniorhigh = new SeniorHighModel; 
		$result = array(
			'type' => "Senior High",
			'pending' => (int) $seniorhigh->all_total_pending()->total_pending,
			'approved' => (int) $seniorhigh->all_total_approved()->total_approved,
			'disapproved' => (int) $seniorhigh->all_total_disapproved()->total_disapproved,
			'archived' => (int) $seniorhigh->all_total_archived()->total_archived,
			'void' => (int) $seniorhigh->all_total_void()->total_void,
		);
		$this->response($result, RestController::HTTP_OK);
	}


	public function all_total_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$result = (int) $seniorhigh->all_total();
		$this->response($result, RestController::HTTP_OK);
	}



	public function all_status_by_barangay_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$data = $seniorhigh->all_status_by_barangay();

		// Initialize arrays for labels and datasets
		$labels = array();
		$datasets = array(
			array('label' => 'Approved', 'backgroundColor' => '#0dcaf0', 'data' => array()),
			array('label' => 'Pending', 'backgroundColor' => '#ffc107', 'data' => array()),
			array('label' => 'Disapproved', 'backgroundColor' => '#f87979', 'data' => array())
		);

		// Populate labels and datasets
		foreach ($data as $item) {
			$labels[] = $item['address'];
			$datasets[0]['data'][] = $item['approved'];
			$datasets[1]['data'][] = $item['pending'];
			$datasets[2]['data'][] = $item['disapproved'];
		}

		// Assemble the final result
		$result = array(
			'labels' => $labels,
			'datasets' => $datasets
		);

		$this->response($result, RestController::HTTP_OK);
	}





	public function generate_report_get()
	{
		$seniorhigh = new SeniorHighModel;
		$CryptoHelper = new CryptoHelper;
		$requestData = $this->input->get();
		$data = [];

		$data = array();
		if (isset($requestData['school']) && !empty($requestData['school'])) {
			$data['s.id'] = $requestData['school'];
		}
		if (isset($requestData['semester']) && !empty($requestData['semester'])) {
			$data['semester'] = $requestData['semester'];
		}
		if (isset($requestData['school_year']) && !empty($requestData['school_year'])) {
			$data['school_year'] = $requestData['school_year'];
		}
		if (isset($requestData['status']) && !empty($requestData['status'])) {
			$data['app_status'] = $requestData['status'];
		}
		if (isset($requestData['availment']) && !empty($requestData['availment'])) {
			$data['availment'] = $requestData['availment'];
		}
		if (isset($requestData['sex']) && !empty($requestData['sex'])) {
			$data['sex'] = $requestData['sex'];
		}
		if (isset($requestData['grade_level']) && !empty($requestData['grade_level'])) {
			$data['grade_level'] = $requestData['grade_level'];
		}
		if (isset($requestData['address']) && !empty($requestData['address'])) {
			$data['barangay.id'] = $requestData['address'];
		}

		if (isset($requestData['strand']) && !empty($requestData['strand'])) {
			$data['strand.id'] = $requestData['strand'];
		}
		$result = $seniorhigh->generate_report($data);

		$this->response($result, RestController::HTTP_OK);
	}




	public function get_data_by_gender_get()
	{
		$seniorhigh = new SeniorHighModel;
		$requestData = $this->input->get();


		$filter_data = [];
		if (isset($requestData['school']) && !empty($requestData['school'])) {
			$filter_data['school'] = $requestData['school'];
		}
		if (isset($requestData['semester']) && !empty($requestData['semester'])) {
			$filter_data['semester'] = $requestData['semester'];
		}
		if (isset($requestData['school_year']) && !empty($requestData['school_year'])) {
			$filter_data['school_year'] = $requestData['school_year'];
		}


		
		$result = $seniorhigh->get_data_by_gender($filter_data);
		 

		$data = [];


		if (!$result) {
			$data = array(
				'male' => 0,
				'female' => 0,
			);
		} else {
			$data = array(
				'male' => $result[1]->total,
				'female' => $result[0]->total,
			);

		}


		$this->response($data, RestController::HTTP_OK);
	}





	public function all_gender_get()
	{
		$seniorhigh = new SeniorHighModel;

		$result = $seniorhigh->all_gender();
		$data = [];


		if (!$result) {
			$data = array(
				'male' => 0,
				'female' => 0,
			);
		} else {
			$data = array(
				'male' => $result[1]->total,
				'female' => $result[0]->total,
			);

		}


		$this->response($data, RestController::HTTP_OK);
	}
 

	public function get_fourps_beneficiary_get()
    {
		$seniorhigh = new SeniorHighModel;
        $requestData = $this->input->get();


        $filter_data = [];

        if (isset($requestData['semester']) && !empty($requestData['semester'])) {
            $filter_data['semester'] = $requestData['semester'];
        }
        if (isset($requestData['school_year']) && !empty($requestData['school_year'])) {
            $filter_data['school_year'] = $requestData['school_year'];
        }
        $result = $seniorhigh->get_fourps_beneficiary($filter_data);

         

		$this->response( (int) $result->total, RestController::HTTP_OK);
    }


	public function all_fourps_beneficiary_get()
    {
		$seniorhigh = new SeniorHighModel; 
 
        $result = $seniorhigh->all_fourps_beneficiary(); 
         

		$this->response( (int) $result->total, RestController::HTTP_OK);
    }
}
