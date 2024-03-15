<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class College extends RestController
{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        $this->load->model('CollegeModel');
        $this->load->helper('crypto_helper');
        $this->load->model('SystemSequenceModel');
    }



    public function get_by_status_get()
    {

        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $data = array(
            'app_status' => $this->input->get('status'),
        );
        $result = $college->get_by_status($data); // current status list
        $this->response($result, RestController::HTTP_OK);
    }

    public function get_all_by_status_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $data = array(
            'app_status' => $this->input->get('status'),
        );
        $result = $college->get_all_by_status($data);
        $this->response($result, RestController::HTTP_OK);
    }


    public function filter_by_status_get()
    {

        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $data = array(
            'app_status' => $this->input->get('status'),
            'school_year' => $this->input->get('school_year'),
            'semester' => $this->input->get('semester'),
        );

        $result = $college->filter_by_status($data);
        $this->response($result, RestController::HTTP_OK);
    }



    public function update_put($id)
    {


        $college = new CollegeModel;
        $requestData = json_decode($this->input->raw_input_stream, true);
        $data = array(
            'app_year_number' => $requestData['app_year_number'],
            'app_id_number' => $requestData['app_id_number'],
            'app_sem_number' => $requestData['app_sem_number'],
            'availment' => $requestData['availment'],
            'school' => $requestData['school'],
            'course' => $requestData['course'],
            'unit' => $requestData['unit'],
            'year_level' => $requestData['year_level'],
            'semester' => $requestData['semester'],
            'school_year' => $requestData['school_year'],
            'app_status' => $requestData['app_status'],
            'reason' => json_encode($requestData['reason']),
        );


        $update_result = $college->update($id, $data);

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
        $college = new CollegeModel;

        $requestData = json_decode($this->input->raw_input_stream, true);


        $data = array(
            'app_status' => $requestData['status'],
        );

        $update_result = $college->update($id, $data);

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

        $college = new CollegeModel;
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
            $data['reason'] = $requestData['reason'];
        }
        $result = $college->bulk_status_update($data, $ids);

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





    public function total_status_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $result = array(
            'type' => "College",
            'pending' => (int) $college->total_pending()->total_pending,
            'approved' => (int) $college->total_approved()->total_approved,
            'disapproved' => (int) $college->total_disapproved()->total_disapproved,
            'archived' => (int) $college->total_archived()->total_archived,
            'void' => (int) $college->total_void()->total_void,
        );
        $this->response($result, RestController::HTTP_OK);
    }



    public function total_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $result = (int) $college->total();
        $this->response($result, RestController::HTTP_OK);
    }




    public function get_status_by_barangay_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $data = $college->get_status_by_barangay();
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



    public function filter_total_status_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = $this->input->get();
        $data = array(
            'semester' => !empty($requestData['semester']) ? $requestData['semester'] : '',
            'school_year' => !empty($requestData['school_year']) ? $requestData['school_year'] : '',
        );

        $result = array(
            'type' => "College",
            'pending' => (int) $college->filter_total_pending($data)->total_pending,
            'approved' => (int) $college->filter_total_approved($data)->total_approved,
            'disapproved' => (int) $college->filter_total_disapproved($data)->total_disapproved,
            'archived' => (int) $college->filter_total_archived($data)->total_archived,
            'void' => (int) $college->filter_total_void($data)->total_void,
        );
        $this->response($result, RestController::HTTP_OK);
    }


    public function filter_total_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = $this->input->get();
        $data = array(
            'semester' => !empty($requestData['semester']) ? $requestData['semester'] : '',
            'school_year' => !empty($requestData['school_year']) ? $requestData['school_year'] : '',
        );
        $result = $college->filter_total($data);
        $this->response($result, RestController::HTTP_OK);
    }


    public function filter_status_by_barangay_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = $this->input->get();

        $data = array(
            'semester' => $requestData['semester'],
            'school_year' => $requestData['school_year'],
        );
        $data = $college->filter_status_by_barangay($data);


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
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $result = array(
            'type' => "College",
            'pending' => (int) $college->all_total_pending()->total_pending,
            'approved' => (int) $college->all_total_approved()->total_approved,
            'disapproved' => (int) $college->all_total_disapproved()->total_disapproved,
            'archived' => (int) $college->all_total_archived()->total_archived,
            'void' => (int) $college->all_total_void()->total_void,
        );
        $this->response($result, RestController::HTTP_OK);
    }



    public function all_status_by_barangay_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $data = $college->all_status_by_barangay();

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
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $requestData = $this->input->get();
        $data = [];
        if (isset($requestData['school']) && !empty($requestData['school'])) {
            $data['cs.id'] = $requestData['school'];
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
        if (isset($requestData['year_level']) && !empty($requestData['year_level'])) {
            $data['year_level'] = $requestData['year_level'];
        }
        if (isset($requestData['address']) && !empty($requestData['address'])) {
            $data[' barangay.id'] = $requestData['address'];
        }

        if (isset($requestData['course']) && !empty($requestData['course'])) {
            $data[' course.id'] = $requestData['course'];
        }

        $result = $college->generate_report($data);

        $this->response($result, RestController::HTTP_OK);
    }


    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________
    // ____________________

    public function index_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $result = $CryptoHelper->cryptoJsAesEncrypt(json_encode($college->get_student()));
        $this->response($result, RestController::HTTP_OK);
    }



    public function find_get($id)
    {
        $college = new CollegeModel;
        $result = $college->find($id);
        $this->response($result, RestController::HTTP_OK);

    }



    public function insert_post()
    {

        $college = new CollegeModel;
        $system_sequence = new SystemSequenceModel;

        $requestData = json_decode($this->input->raw_input_stream, true);
        $data = array(
            'colAppNoYear' => $requestData['app_no_year'],
            'colAppNoSem' => $requestData['app_no_sem'],
            'colAppNoID' => $requestData['app_no_id'],
            'colAppStat' => 'Pending',
            'colFirstName' => $requestData['firstname'],
            'colLastName' => $requestData['lastname'],
            'colMI' => $requestData['middle_initial'],
            'colSuffix' => $requestData['suffix'],
            'colAddress' => $requestData['address'],
            'colDOB' => date("m/d/Y", strtotime($requestData['birthdate'])),
            'colAge' => $requestData['age'],
            'colCivilStat' => $requestData['civil_status'],
            'colGender' => $requestData['sex'],
            'colContactNo' => $requestData['contact_number'],
            'colCTC' => $requestData['ctc_number'],
            'colEmailAdd' => $requestData['email_address'],
            'colAvailment' => $requestData['availment'],
            'colSchool' => $requestData['school'],
            'colCourse' => $requestData['course'],
            'colSchoolAddress' => $requestData['school_address'],
            'colYearLevel' => $requestData['year_level'],
            'colSem' => $requestData['semester'],
            'colUnits' => $requestData['units'],
            'colSY' => $requestData['school_year'],
            'colFathersName' => $requestData['father_name'],
            'colFatherOccu' => $requestData['father_occupation'],
            'colMothersName' => $requestData['mother_name'],
            'colMotherOccu' => $requestData['mother_occupation'],
            'colManager' => 'Active'
        );

        $result = $college->insert($data);

        if ($result > 0) {

            // update the system app no
            $appno_data = array(
                'seq_appno' => $requestData['app_no_id'],
            );
            $system_sequence->update(2, $appno_data);

            $this->response([
                'status' => true,
                'message' => 'Successfully Inserted.'
            ], RestController::HTTP_OK);
        } else {

            $this->response([
                'status' => false,
                'message' => 'Failed to create new data.'
            ], RestController::HTTP_BAD_REQUEST);
        }
    }


    public function bulk_insert_post()
    {

        $college = new CollegeModel;
        $system_sequence = new SystemSequenceModel;


        $requestData = json_decode($this->input->raw_input_stream, true);

        $result = $college->bulk_insert($requestData);


        if ($result > 0) {
            $this->response([
                'status' => true,
                'message' => 'Successfully Inserted.'
            ], RestController::HTTP_OK);
        } else {

            $this->response([
                'status' => false,
                'message' => 'Failed to create new data.'
            ], RestController::HTTP_BAD_REQUEST);
        }
    }










    public function all_total_get()
    {
        $college = new CollegeModel;
        $CryptoHelper = new CryptoHelper;
        $result = (int) $college->all_total();
        $this->response($result, RestController::HTTP_OK);
    }









}