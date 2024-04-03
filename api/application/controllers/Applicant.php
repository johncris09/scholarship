<?php

// namespace App\Classes;
defined('BASEPATH') or exit ('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;




class Applicant extends RestController
{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        $this->load->model('ScholarshipModel');
        $this->load->model('SeniorHighModel');
        $this->load->model('TvetModel');
        $this->load->model('CollegeModel');
        $this->load->model('SystemSequenceModel');
        $this->load->helper(array('form', 'url'));
        $this->load->helper('sort');
    }
    public function index_get()
    {
        $model = new ScholarshipModel;
        $result = $model->getCurrentApplicant();
        $this->response($result, RestController::HTTP_OK);

    }
    public function getAll_get()
    {
        $model = new ScholarshipModel;
        $result = $model->getAll();
        $this->response($result, RestController::HTTP_OK);

    }
    public function get_applicant_by_status_get()
    {
        $model = new ScholarshipModel;
        $requestData = $this->input->get();
        $data = array(
            'app_status' => $requestData['status'],
            'school' => $requestData['school']
        );
        $result = $model->get_applicant_by_status($data);
        $this->response($result, RestController::HTTP_OK);
    }
    public function insert_post()
    {
        $senior_high = new SeniorHighModel;
        $college = new CollegeModel;
        $tvet = new TvetModel;
        $system_sequence = new SystemSequenceModel;

        $requestData = json_decode($this->input->raw_input_stream, true);
        $app_number = $this->getApplicationNumber($requestData['scholarship_type']);


        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->row();
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->row();
         
        $data = [];
        if ($requestData['scholarship_type'] == "senior_high") {
            $data = array(
                'scholarship_id' => $requestData['scholarship_id'],
                'app_year_number' => $app_number->seq_year,
                'app_sem_number' => $app_number->seq_sem,
                'app_id_number' => (int) $app_number->seq_appno + 1,
                'school' => $requestData['school'],
                'strand' => $requestData['strand'],
                'grade_level' => $requestData['grade_level'],
                'semester' => $query_sem->current_semester,
                'school_year' => $query_sy->current_sy,
                'availment' => $requestData['availment'],
                'app_status' => 'Pending',
            );
            $result = $senior_high->insert($data);

            $appno_data = array(
                'seq_appno' => (int) $app_number->seq_appno + 1,
            );
            $system_sequence->update(1, $appno_data);


        } else if ($requestData['scholarship_type'] == "college") {
            $data = array(
                'scholarship_id' => $requestData['scholarship_id'],
                'app_year_number' => $app_number->seq_year,
                'app_sem_number' => $app_number->seq_sem,
                'app_id_number' => (int) $app_number->seq_appno + 1,
                'school' => $requestData['school'],
                'course' => $requestData['course'],
                'unit' => $requestData['unit'],
                'year_level' => $requestData['year_level'],
                'semester' => $query_sem->current_semester,
                'school_year' => $query_sy->current_sy,
                'availment' => $requestData['availment'],
                'app_status' => 'Pending',

            );

            $result = $college->insert($data);


            $appno_data = array(
                'seq_appno' => (int) $app_number->seq_appno + 1,
            );
            $system_sequence->update(2, $appno_data);

        } else if ($requestData['scholarship_type'] == "tvet") {
            $data = array(
                'scholarship_id' => $requestData['scholarship_id'],
                'app_year_number' => $app_number->seq_year,
                'app_sem_number' => $app_number->seq_sem,
                'app_id_number' => (int) $app_number->seq_appno + 1,
                'school' => $requestData['school'],
                'course' => $requestData['tvetCourse'],
                'hour_number' => $requestData['hourNumber'],
                'semester' => $query_sem->current_semester,
                'school_year' => $query_sy->current_sy,
                'availment' => $requestData['availment'],
                'app_status' => 'Pending',
            );

            $result = $tvet->insert($data);

            $appno_data = array(
                'seq_appno' => (int) $app_number->seq_appno + 1,
            );
            $system_sequence->update(3, $appno_data);

        }

        if ($result > 0) {
            $this->response([
                'status' => true,
                'message' => 'New Record Created.'
            ], RestController::HTTP_OK);
        } else {

            $this->response([
                'status' => false,
                'message' => 'Failed to create record.'
            ], RestController::HTTP_OK);

        }
    }

    private function getApplicationNumber($scholarship_type)
    {

        $system_sequence = new SystemSequenceModel;
        if ($scholarship_type === 'college') {
            $type = 'college_appno';
        } else if ($scholarship_type === 'tvet') {
            $type = 'tvet_appno';
        } else if ($scholarship_type === 'senior_high') {
            $type = 'shs_appno';
        }

        $result = $system_sequence->getLatestAppNumber(['seq_name' => $type]);
        return $result;

    }


    // Fresh Applicant
    public function insert_new_applicant_post()
    {
        $model = new ScholarshipModel;
        $senior_high = new SeniorHighModel;
        $college = new CollegeModel;
        $tvet = new TvetModel;
        $system_sequence = new SystemSequenceModel;
        // current school year and semester
        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->row();
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->row();

        $requestData = json_decode($this->input->raw_input_stream, true);

        $app_number = $this->getApplicationNumber($requestData['scholarship_type']);

        $reference_number = ucwords($requestData['scholarship_type'][0]) . '' . preg_replace("/\D+/", "", $query_sem->current_semester)
            . '-' . str_replace(["SY: 20", "-20"], "", $query_sy->current_sy) . '-' . $this->getFirstLetters($requestData['firstname']) . '' . $this->getFirstLetters($requestData['lastname']) . '' . date('-mdy', strtotime($requestData['birthdate']));
 
        $data = array(
            'reference_number' => $reference_number,
            'lastname' => preg_replace('/\s+/', ' ', $requestData['lastname']),
            'firstname' => preg_replace('/\s+/', ' ', $requestData['firstname']),
            'middlename' => preg_replace('/\s+/', ' ', $requestData['middlename']),
            'suffix' => preg_replace('/\s+/', ' ', $requestData['suffix']),
            'address' => $requestData['address'],
            'birthdate' => $requestData['birthdate'],
            'civil_status' => $requestData['civil_status'],
            'sex' => $requestData['sex'],
            'contact_number' => preg_replace('/\s+/', ' ', $requestData['contact_number']),
            'email_address' => preg_replace('/\s+/', ' ', $requestData['email_address']),
            'father_name' => preg_replace('/\s+/', ' ', $requestData['father_name']),
            'father_occupation' => preg_replace('/\s+/', ' ', $requestData['father_occupation']),
            'mother_name' => preg_replace('/\s+/', ' ', $requestData['mother_name']),
            'mother_occupation' => preg_replace('/\s+/', ' ', $requestData['mother_occupation']),

        );




        if (isset ($requestData['photo']) && !empty ($requestData['photo'])) {

            $photo = $requestData['photo'];
            $image_array_1 = explode(";", $photo);
            $image_array_2 = explode(",", $image_array_1[1]);
            $image_data = base64_decode($image_array_2[1]);


            $rootFolderPath = FCPATH;
            $parts = explode('/', rtrim($rootFolderPath, '/'));
            $directoryName = end($parts);
            $time = time();
            $image_name = $directoryName . '/' . 'assets/image/scholarship/' . $time . '.png';

            $parentDirectoryPath = dirname(FCPATH);

            // Save the decoded image to a temporary file
            $temp_file = $parentDirectoryPath . '/api/assets/image/scholarship' . '/' . 'temp_image.jpg';
            file_put_contents($temp_file, $image_data);

            // Compress the image
            $source_img = $temp_file;
            $destination_img = $parentDirectoryPath . '/api/assets/image/scholarship' . '/' . $time . '.png';
            $quality = 75;
            $this->compress($temp_file, $destination_img, $quality);

            // Optionally, you can remove the temporary file
            unlink($temp_file);
            $data['photo'] = $time . '.png';
        }
        $insertApplicant = $model->insertNewApplicant($data);


        if ($requestData['scholarship_type'] == "senior_high") {
            $data = array(
                'scholarship_id' => $insertApplicant,
                'app_year_number' => $app_number->seq_year,
                'app_sem_number' => $app_number->seq_sem,
                'app_id_number' => (int) $app_number->seq_appno + 1,
                'school' => $requestData['school'],
                'strand' => $requestData['strand'],
                'grade_level' => $requestData['grade_level'],
                'semester' => $query_sem->current_semester,
                'school_year' => $query_sy->current_sy,
                'availment' => $requestData['availment'],
                // 'ctc' => $requestData['ctc'],
                'app_status' => 'Pending',
            );


            $result = $senior_high->insert($data);

            $appno_data = array(
                'seq_appno' => (int) $app_number->seq_appno + 1,
            );
            $system_sequence->update(1, $appno_data);


        } else if ($requestData['scholarship_type'] == "college") {
            $data = array(
                'scholarship_id' => $insertApplicant,
                'app_year_number' => $app_number->seq_year,
                'app_sem_number' => $app_number->seq_sem,
                'app_id_number' => (int) $app_number->seq_appno + 1,
                'school' => $requestData['school'],
                'course' => $requestData['course'],
                'unit' => $requestData['unit'],
                'year_level' => $requestData['year_level'],
                'semester' => $query_sem->current_semester,
                'school_year' => $query_sy->current_sy,
                'availment' => $requestData['availment'],

                'app_status' => 'Pending',
            );



            $result = $college->insert($data);


            $appno_data = array(
                'seq_appno' => (int) $app_number->seq_appno + 1,
            );
            $system_sequence->update(2, $appno_data);

        } else if ($requestData['scholarship_type'] == "tvet") {
            $data = array(
                'scholarship_id' => $insertApplicant,
                'app_year_number' => $app_number->seq_year,
                'app_sem_number' => $app_number->seq_sem,
                'app_id_number' => (int) $app_number->seq_appno + 1,
                'school' => $requestData['school'],
                'course' => $requestData['tvetCourse'],
                'hour_number' => $requestData['hourNumber'],
                'semester' => $query_sem->current_semester,
                'school_year' => $query_sy->current_sy,
                'availment' => $requestData['availment'], 
                'app_status' => 'Pending',
            );


            $result = $tvet->insert($data);


            $appno_data = array(
                'seq_appno' => (int) $app_number->seq_appno + 1,
            );
            $system_sequence->update(3, $appno_data);

        }


        if ($result > 0) {
            $this->response([
                'status' => true,
                'message' => 'New Record Created.'
            ], RestController::HTTP_OK);
        } else {

            $this->response([
                'status' => false,
                'message' => 'Failed to create record.'
            ], RestController::HTTP_OK);

        }
    }


    function getFirstLetters($str)
    {
        $words = explode(' ', ucwords($str)); // Capitalize each word and split into an array
        $firstLetters = array_map(function ($word) {
            return substr($word, 0, 1); // Get the first letter of each word
        }, $words);

        return implode('', $firstLetters); // Combine the first letters into a single string
    }
    public function get_get($id)
    {
        $model = new ScholarshipModel;
        $result = $model->get($id);
        $this->response($result, RestController::HTTP_OK);

    }

    // application details in his/her school
    public function getApplicationDetails_get($id)
    {
        $model = new ScholarshipModel;
        $result = $model->getApplicationDetails($id);
        $this->response($result, RestController::HTTP_OK);

    }

    public function update_put($id)
    {


        $model = new ScholarshipModel;

        $requestData = json_decode($this->input->raw_input_stream, true);

        $data = array(
            'reference_number' => $requestData['reference_number'],
            'lastname' => $requestData['lastname'],
            'firstname' => $requestData['firstname'],
            'middlename' => $requestData['middlename'],
            'suffix' => $requestData['suffix'],
            'address' => $requestData['address'],
            'birthdate' => $requestData['birthdate'],
            'civil_status' => $requestData['civil_status'],
            'sex' => $requestData['sex'],
            'contact_number' => $requestData['contact_number'],
            'email_address' => $requestData['email_address'],
            'father_name' => $requestData['father_name'],
            'father_occupation' => $requestData['father_occupation'],
            'mother_name' => $requestData['mother_name'],
            'mother_occupation' => $requestData['mother_occupation'],
        );

        $result = $model->update($id, $data);

        if ($result > 0) {
            $this->response([
                'status' => true,
                'message' => 'Information Updated.'
            ], RestController::HTTP_OK);
        } else {

            $this->response([
                'status' => false,
                'message' => 'Failed to update information.'
            ], RestController::HTTP_BAD_REQUEST);

        }
    }



    function compress($source, $destination, $quality)
    {
        $info = getimagesize($source);

        if ($info['mime'] == 'image/jpeg')
            $image = imagecreatefromjpeg($source);
        elseif ($info['mime'] == 'image/gif')
            $image = imagecreatefromgif($source);
        elseif ($info['mime'] == 'image/png')
            $image = imagecreatefrompng($source);

        imagejpeg($image, $destination, $quality);

        return $destination;
    }




    public function update_photo_put($id)
    {

        $model = new ScholarshipModel;

        $requestData = json_decode($this->input->raw_input_stream, true);
        $photo = $requestData['photo'];
        $image_array_1 = explode(";", $photo);
        $image_array_2 = explode(",", $image_array_1[1]);
        $data = base64_decode($image_array_2[1]);


        $rootFolderPath = FCPATH;
        $parts = explode('/', rtrim($rootFolderPath, '/'));
        $directoryName = end($parts);
        $time = time();
        $image_name = $directoryName . '/' . 'assets/image/scholarship/' . $time . '.png';

        $parentDirectoryPath = dirname(FCPATH);

        // Save the decoded image to a temporary file
        $temp_file = $parentDirectoryPath . '/api/assets/image/scholarship' . '/' . 'temp_image.jpg';
        file_put_contents($temp_file, $data);

        // Compress the image
        $source_img = $temp_file;
        $destination_img = $parentDirectoryPath . '/api/assets/image/scholarship' . '/' . $time . '.png';
        $quality = 75;
        $this->compress($temp_file, $destination_img, $quality);

        // Optionally, you can remove the temporary file
        unlink($temp_file);



        $data = array(
            'photo' => $time . '.png',
        );

        $result = $model->update($id, $data);

        if ($result > 0) {
            $this->response([
                'status' => true,
                'message' => 'Profile Photo Updated',
            ], RestController::HTTP_OK);
        } else {

            $this->response([
                'status' => false,
                'message' => 'Failed to update information.'
            ], RestController::HTTP_BAD_REQUEST);

        }
    }

    public function update_applicant_details_put($id)
    {



        $senior_high = new SeniorHighModel;
        $college = new CollegeModel;
        $tvet = new TvetModel;

        $requestData = json_decode($this->input->raw_input_stream, true);

        if ($requestData['scholarship_type'] == "senior_high") {
            $data = array(
                'id' => $requestData['id'],
                'app_year_number' => $requestData['app_year_number'],
                'app_sem_number' => $requestData['app_sem_number'],
                'app_id_number' => $requestData['app_id_number'],
                'school' => $requestData['school'],
                'strand' => $requestData['strand'],
                'grade_level' => $requestData['grade_level'],
                'semester' => $requestData['semester'],
                'school_year' => $requestData['school_year'],
                'availment' => $requestData['availment'],
                // 'ctc' => $requestData['ctc'],
                'app_status' => $requestData['app_status'],
            );


            $result = $senior_high->update($requestData['id'], $data);


        } else if ($requestData['scholarship_type'] == "college") {
            $data = array(
                'id' => $requestData['id'],
                'app_year_number' => $requestData['app_year_number'],
                'app_sem_number' => $requestData['app_sem_number'],
                'app_id_number' => $requestData['app_id_number'],
                'school' => $requestData['school'],
                'course' => $requestData['course'],
                'unit' => $requestData['unit'],
                'year_level' => $requestData['year_level'],
                'semester' => $requestData['semester'],
                'school_year' => $requestData['school_year'],
                'availment' => $requestData['availment'],
                // 'ctc' => $requestData['ctc'],
                'app_status' => $requestData['app_status'],
            );



            $result = $college->update($requestData['id'], $data);

        } else if ($requestData['scholarship_type'] == "tvet") {
            $data = array(
                'id' => $requestData['id'],
                'app_year_number' => $requestData['app_year_number'],
                'app_sem_number' => $requestData['app_sem_number'],
                'app_id_number' => $requestData['app_id_number'],
                'school' => $requestData['school'],
                'course' => $requestData['tvetCourse'],
                'hour_number' => $requestData['hourNumber'],
                'semester' => $requestData['semester'],
                'school_year' => $requestData['school_year'],
                'availment' => $requestData['availment'],
                'app_status' => $requestData['app_status'],
            );


            $result = $tvet->update($requestData['id'], $data);
        }

        if ($result > 0) {
            $this->response([
                'status' => true,
                'message' => 'Information Updated.'
            ], RestController::HTTP_OK);
        } else {

            $this->response([
                'status' => false,
                'message' => 'Failed to update information.'
            ], RestController::HTTP_BAD_REQUEST);

        }
    }

    function verify_get()
    {


        $model = new ScholarshipModel;
        $requestData = $this->input->get();
        $result = $model->verify($requestData);
        $this->response($result, RestController::HTTP_OK);
    }

    function get_sibling_get()
    {
        $model = new ScholarshipModel;
        $data = $model->get_sibling();

        $grouped = [];

        foreach ($data as $person) {
            $key = $person->mother_name ?? $person->father_name;
            if (!isset ($grouped[$key])) {
                $grouped[$key] = [];
            }
            $grouped[$key][] = $person;
        }
        $grouped = array_filter($grouped, function ($group) {
            return count($group) > 1;
        });
        $flattened = [];
        foreach ($grouped as $group) {
            foreach ($group as $person) {
                $flattened[] = $person;
            }
        }


        $matching_records = [];

        $count = count($data);
        for ($i = 0; $i < $count; $i++) {
            for ($j = $i + 1; $j < $count; $j++) {
                if ($data[$i]->mother_name == $data[$j]->mother_name || $data[$i]->father_name == $data[$j]->father_name) {
                    $matching_records[] = $data[$i];
                    $matching_records[] = $data[$j];
                }
            }
        }

        $matching_records = array_values( array_unique($matching_records, SORT_REGULAR));

        // $sameMother = [];

        // foreach ($matching_records as $entry) {
        //     $key = $entry->mother_name;
        //     if (!isset ($sameMother[$key])) {
        //         $sameMother[$key] = [];
        //     }
        //     $sameMother[$key][] = ['id' => $entry->id, 'firstname' => $entry->firstname, 'father_name' => $entry->father_name];
        // }


        // $result = array_values(array_filter($sameMother, function($group) {
        //     return count($group) > 1;
        // }));
        
        
        // $sameFather = [];

        // foreach ($matching_records as $entry) {
        //     $key = $entry->father_name;
        //     if (!isset ($sameFather[$key])) {
        //         $sameFather[$key] = [];
        //     }
        //     $sameFather[$key][] = ['id' => $entry->id, 'firstname' => $entry->firstname, 'father_name' => $entry->father_name];
        // }


        // $result = array_values(array_filter($sameFather, function($group) {
        //     return count($group) > 1;
        // }));


        $this->response($matching_records, RestController::HTTP_OK);
    }


    function get_all_sibling_get()
    {
        $model = new ScholarshipModel;
        $result = $model->get_all_sibling();
        $this->response($result, RestController::HTTP_OK);
    }
    function filter_sibling_get()
    {
        $model = new ScholarshipModel;
        $requestData = $this->input->get();
        $result = $model->filter_sibling($requestData);
        $this->response($result, RestController::HTTP_OK);
    }

}