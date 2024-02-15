<?php

// namespace App\Classes;
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;




class Scholar extends RestController
{

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        $this->load->model('ScholarModel');
    }



    //used to consolidate seniorhigh data from old to new

    // 5562 - latest id in senior high
    // 5165 - latest id in scholarship


    // 1: fetch all old data in senior high and match it to new record('scholarship')
    //     usiing lastname and firstname
    // 2. if found then
    //     insert to senior_high table and update table_registration(old data) set remark to 'checked'
    // 3. the remaining data that was not found,
    //     $notchecked = fetch the old data where remark is not checked.
    //     $new record = match the $notchecked to $newRecord using lastname only
    //     and display it to view
    //     - In view, display the $notchecked in left side and $newRecord in right side
    //     insert to scholarship table
    //     insert to SeniorHigh table
    //     update table_registration set remarks to 'checked'


    // public function index_get()
    // {

    //     $model = new ScholarModel; 
    //     $data = array(
    //         'notchecked' => $model->seniorHighNotChecked(),
    //         'newrecord' => $model->seniorHighMatchedToNewData(), // search by lastname
    //     );

    //     $this->load->view('seniorHigh', $data);

    // }




    //used to consolidate college data from old to new

    // 5542 - latest id in college 


    // 1: fetch all old data in college and match it to new record('scholarship')
    //     usiing lastname and firstname
    // 2. if found then
    //     insert to senior_high table and update table_collegeapp(old data) set remark to 'checked'
    // 3. the remaining data that was not found,
    //     $notchecked = fetch the old data where remark is not checked.
    //     $new record = match the $notchecked to $newRecord using lastname only
    //     and display it to view
    //     - In view, display the $notchecked in left side and $newRecord in right side
    //     insert to scholarship table
    //     insert to SeniorHigh table
    //     update table_collegeapp set remarks to 'checked'


    public function index_get()
    {

        $model = new ScholarModel;
      

        // step 1
        // foreach ($model->college()['found'] as $row) {
        //     echo $row['insert'];
        //     echo "<br />";
        //     echo $row['update'];
        //     echo "<br />"; 
        //     echo "<br />"; 

        // }

        // $this->response($model->college(), RestController::HTTP_OK);

        // $data = array(
        //     'notchecked' => $model->collegeNotChecked(),
        //     'newrecord' => $model->collegeMatchedToNewData(), // search by lastname
        // ); 

        // $this->load->view('college', $data);

    }


    // public function index_get()
    // {


    //     $model = new ScholarModel;
    //     $result = $model->getAllScholarship();
    //     foreach ($result as $row) {
    //         // $firstname = $this->getFirstLetters($row->firstname);
    //         // $lastname = $this->getFirstLetters($row->lastname);

    //         // // echo $firstname.''.$lastname;
    //         $name = $row->lastname . ' ' . $row->firstname;
    //         $appDetail = $model->getAppDetails($name);
    //         foreach ($appDetail as $detail) {
    //             // echo json_encode($detail);
    //             if ($detail->scholarship_type == "senior high") {
    //                 // insert to senior high table
    //                 $seniorHighData = array(
    //                     'old_id' => $detail->id,
    //                     'scholarship_id' => $row->id,
    //                     'app_year_number' => $detail->app_year_number,
    //                     'app_id_number' => $detail->app_id_number,
    //                     'app_sem_number' => $detail->app_sem_number,
    //                     'ctc' => $detail->ctc,
    //                     'availment' => $detail->availment,
    //                     'school' => $detail->school,
    //                     'strand' => $detail->course,
    //                     'grade_level' => $detail->year_level,
    //                     'semester' => $detail->semester,
    //                     'school_year' => $detail->school_year,
    //                     'app_status' => $detail->app_status

    //                 );
    //                 // $model->insertToTable('senior_high',$seniorHighData);
    //                 echo json_encode($seniorHighData);

    //             } else if ($detail->scholarship_type == "college") {
    //                 // insert tocollege table
    //                 $collegeData = array(
    //                     'old_id' => $detail->id,
    //                     'scholarship_id' => $row->id,
    //                     'app_year_number' => $detail->app_year_number,
    //                     'app_id_number' => $detail->app_id_number,
    //                     'app_sem_number' => $detail->app_sem_number,
    //                     'ctc' => $detail->ctc,
    //                     'availment' => $detail->availment,
    //                     'school' => $detail->school,
    //                     'course' => $detail->course,
    //                     'unit' => $detail->unit,
    //                     'year_level' => $detail->year_level,
    //                     'semester' => $detail->semester,
    //                     'school_year' => $detail->school_year,
    //                     'app_status' => $detail->app_status

    //                 );
    //                 // echo json_encode($collegeData);
    //                 // $model->insertToTable('college',$collegeData);
    //             } else if ($detail->scholarship_type == "tvet") {
    //                 // insert to tvet table
    //                 $tvetData = array(
    //                     'old_id' => $detail->id,
    //                     'scholarship_id' => $row->id,
    //                     'app_year_number' => $detail->app_year_number,
    //                     'app_id_number' => $detail->app_id_number,
    //                     'app_sem_number' => $detail->app_sem_number,
    //                     'ctc' => $detail->ctc,
    //                     'availment' => $detail->availment,
    //                     'school' => $detail->school,
    //                     'course' => $detail->course,
    //                     'hour_number' => $detail->unit,
    //                     'year_level' => $detail->year_level,
    //                     'semester' => $detail->semester,
    //                     'school_year' => $detail->school_year,
    //                     'app_status' => $detail->app_status
    //                 );
    //                 // echo json_encode($tvetData);

    //                 // $model->insertToTable('tvet',$tvetData);
    //             }
    //             echo "<hr />";

    //         }
    //         // $sType = "";
    //         // if($appDetail->scholarship_type === "senior high"){
    //         //     $sType = "S";

    //         // }else if($appDetail->scholarship_type === "college"){
    //         //     $sType = "C";
    //         //    }else   if($appDetail->scholarship_type === "tvet"){
    //         //     $sType = "T";
    //         //    }

    //         //    echo $sType.''; // scholarship type
    //         //    echo $appDetail->application_semester; // application semester
    //         //    echo '-'.str_replace(["SY: 20", "-20"],"", $appDetail->sy); // school year
    //         //    echo '-'.$firstname .''. $lastname; // abbreviated name
    //         //    echo date( '-mdy' ,strtotime( $appDetail->birthdate)); // birth date

    //         //    $reference_number = $sType.''.$appDetail->application_semester.'-'.str_replace(["SY: 20", "-20"],"", $appDetail->sy).'-'.$this->getFirstLetters($row->firstname) .''. $this->getFirstLetters($row->lastname).date( '-mdy' ,strtotime( $appDetail->birthdate));
    //         //    echo $reference_number;

    //         //    $data = array(
    //         //     'reference_number' => $reference_number,
    //         //     'firstname' => $row->firstname,
    //         //     'lastname' => $row->lastname,
    //         //     'middlename' => $row->middlename,
    //         //     'suffix' => $row->suffix, 
    //         //     'address' => $row->address, 
    //         //     'birthdate' =>date('Y-m-d', strtotime($row->birthdate)), 
    //         //     'civil_status' => $row->civil_status, 
    //         //     'sex' => $row->sex, 
    //         //     'contact_number' => $row->contact_number, 
    //         //     'email_address' => $row->email_address, 
    //         //     'father_name' => $row->father_name, 
    //         //     'father_occupation' => $row->father_occupation, 
    //         //     'mother_name' => $row->mother_name, 
    //         //     'mother_occupation' => $row->mother_occupation
    //         //    );



    //         //    $insert = $model->insert($data);
    //         //    echo json_encode($insert);
    //         echo '<hr/>';
    //         // echo '<br/>';
    //     }
    //     // $this->response( $result, 200 );



    // }

    public function barangay_get()
    {



        $model = new ScholarModel;
        $result = $model->getBarangay();
        foreach ($result as $row) {

            $data = array(
                'address' => $row->id
            );
            $update = $model->updateAddress($row->barangay, $data);

            // UPDATE `scholarship` SET `address` = '1' 
            // WHERE `scholarship`.`id` = 5120;

            echo json_encode($data);
            echo "<br />";
        }


    }

    public function senior_high_school_get()
    {



        $model = new ScholarModel;
        $result = $model->getSeniorHighSchool();
        foreach ($result as $row) {


            // $data = array(
            //     'abbreviation' => $row->AppSchool
            // );

            // $inset = $model->insertToTable('senior_high_school', $data);
            // $update = $model->updateAddress($row->barangay, $data);

            // // UPDATE `scholarship` SET `address` = '1' 
            // // WHERE `scholarship`.`id` = 5120;

            echo json_encode($row);
            echo "<br />";
        }


    }



    public function college_school_get()
    {



        $model = new ScholarModel;
        $result = $model->getCollegeSchool();

        // $this->response($result, RestController::HTTP_OK);
        foreach ($result as $row) {


            $data = array(
                'school' => $row->id
            );

            // $inset = $model->insertToTable('college_schoeol', $data);
            $update = $model->updateCollegeSchool($row->school, $data);

            // // UPDATE `scholarship` SET `address` = '1' 
            // // WHERE `scholarship`.`id` = 5120;

            echo json_encode($row);
            echo "<br />";
        }


    }

    public function strand_get()
    {



        $model = new ScholarModel;
        $result = $model->getStrand();

        foreach ($result as $row) {


            $data = array(
                'strand' => $row->id
            );

            // $inset = $model->insertToTable('strand', $data);
            // $update = $model->updateStrand($row->strand, $data);



            echo json_encode($row);
            echo "<br />";
        }


    }





    public function course_get()
    {



        $model = new ScholarModel;
        $result = $model->getCollegeCourse();

        foreach ($result as $row) {


            $data = array(
                'course' => $row->id
            );

            // $inset = $model->insertToTable('course', $data);
            // $update = $model->updateCourse($row->course, $data);

            echo json_encode($row);
            echo "<br />";
        }


    }


    public function college_get()
    {



        $model = new ScholarModel;

        $record = $model->getAllScholarship();
        $data = [];
        $data['record'] = $record;
        foreach ($record as $a) {
            $result = $model->getAllCollege($a->id);
            if (!empty($result)) {
                // echo "
                //    <table style='
                //    border: 1px solid black; width: 100%'>
                //    <tr>
                //     <td><h4>$a->id</h4></td>
                //     <td colspan='5'><h4>$a->lastname $a->firstname $a->middlename</h4></td>

                //    </tr>
                //        <tr>
                //            <td>id</td>
                //            <td>old_id</td>
                //            <td>scholarship_id</td>
                //            <td>app_year_number</td>
                //            <td>app_id_number</td>
                //            <td>app_sem_number</td>
                //            <td>ctc</td>
                //            <td>availment</td>
                //            <td>school</td>
                //            <td>course</td>
                //            <td>unit</td>
                //            <td>year_level</td>
                //            <td>semester</td>
                //            <td>school_year</td>
                //            <td>app_status</td>

                //        </tr>
                //        ";

                foreach ($result as $row) {
                    // $data['data'][] = $row;

                    //    echo "
                    //        <tr>
                    //            <td>$row->id</td>
                    //            <td>$row->old_id</td>
                    //            <td>$row->scholarship_id</td>
                    //            <td>$row->app_year_number</td>
                    //            <td>$row->app_id_number</td>
                    //            <td>$row->app_sem_number</td>
                    //            <td>$row->ctc</td>
                    //            <td>$row->availment</td>
                    //            <td>$row->school</td>
                    //            <td>$row->course</td>
                    //            <td>$row->unit</td>
                    //            <td>$row->year_level</td>
                    //            <td>$row->semester</td>
                    //            <td>$row->school_year</td>
                    //            <td>$row->app_status</td>
                    //        </tr>
                    //    ";

                }
                //    echo   "
                //        </table>
                //        <hr />
                //    ";

            }



        }

        // echo json_encode($data);

        $this->load->view('college', $data);
        // $result = $model->getAllCollege($scholarship_id);
        // echo "
        //     <table>
        //     <tr>
        //         <td>id</td>
        //         <td>old_id</td>
        //         <td>scholarship_id</td>
        //         <td>app_year_number</td>
        //         <td>app_id_number</td>
        //         <td>app_sem_number</td>
        //         <td>ctc</td>
        //         <td>availment</td>
        //         <td>school</td>
        //         <td>course</td>
        //         <td>unit</td>
        //         <td>year_level</td>
        //         <td>semester</td>
        //         <td>school_year</td>
        //         <td>app_status</td>

        //     </tr>
        //     ";

        // foreach ($result as $row){

        //     echo "
        //         <tr>
        //             <td>$row->id</td>
        //             <td>$row->old_id</td>
        //             <td>$row->scholarship_id</td>
        //             <td>$row->app_year_number</td>
        //             <td>$row->app_id_number</td>
        //             <td>$row->app_sem_number</td>
        //             <td>$row->ctc</td>
        //             <td>$row->availment</td>
        //             <td>$row->school</td>
        //             <td>$row->course</td>
        //             <td>$row->unit</td>
        //             <td>$row->year_level</td>
        //             <td>$row->semester</td>
        //             <td>$row->school_year</td>
        //             <td>$row->app_status</td>
        //         </tr>
        //     ";

        // }



        // echo   "
        // </table>

        // ";

    }


    function college_insert_post()
    {


        $model = new ScholarModel;

        $rowId = isset($_POST['rowId']) ? $_POST['rowId'] : null;
        $schoolValue = isset($_POST['schoolValue']) ? $_POST['schoolValue'] : null;
        $courseValue = isset($_POST['courseValue']) ? $_POST['courseValue'] : null;

        $data = [
            'school' => $schoolValue,
            'course' => $courseValue,
        ];


        $update = $model->updateCollege($rowId, $data);




        $this->response($update, RestController::HTTP_OK);
    }




    function consolidate_senior_high_post()
    {


        $model = new ScholarModel;
        $insertID = $model->insertToNewRecord([

            'reference_number' => $_POST['reference_number'],
            'lastname' => $_POST['lastname'],
            'firstname' => $_POST['firstname'],
            'middlename' => $_POST['middlename'],
            'suffix' => $_POST['suffix'],
            'address' => $_POST['address'],
            'birthdate' => $_POST['birthdate'],
            'civil_status' => $_POST['civil_status'],
            'sex' => $_POST['sex'],
            'contact_number' => $_POST['contact_number'],
            'email_address' => $_POST['email_address'],
            'father_name' => $_POST['father_name'],
            'father_occupation' => $_POST['father_occupation'],
            'mother_name' => $_POST['mother_name'],
            'mother_occupation' => $_POST['mother_occupation'],

        ]);

        if ($insertID) {

            $insertToSeniorHigh = $model->insertToSeniorHigh([
                'old_id' => $_POST['row_id'],
                'scholarship_id' => $insertID,
                'app_year_number' => $_POST['app_year_number'],
                'app_id_number' => $_POST['app_id_number'],
                'app_sem_number' => $_POST['app_sem_number'],
                'ctc' => $_POST['ctc'],
                'availment' => $_POST['availment'],
                'school' => $_POST['school'],
                'strand' => $_POST['strand'],
                'grade_level' => $_POST['grade_level'],
                'semester' => $_POST['semester'],
                'school_year' => $_POST['school_year'],
                'app_status' => $_POST['app_status'],


            ]);
        }

        $this->response($insertToSeniorHigh, RestController::HTTP_OK);
    }

 
    function consolidate_college_post()
    {


        $model = new ScholarModel;
        $insertID = $model->insertToNewRecord([

            'reference_number' => $_POST['reference_number'],
            'lastname' => $_POST['lastname'],
            'firstname' => $_POST['firstname'],
            'middlename' => $_POST['middlename'],
            'suffix' => $_POST['suffix'],
            'address' => $_POST['address'],
            'birthdate' => $_POST['birthdate'],
            'civil_status' => $_POST['civil_status'],
            'sex' => $_POST['sex'],
            'contact_number' => $_POST['contact_number'],
            'email_address' => $_POST['email_address'],
            'father_name' => $_POST['father_name'],
            'father_occupation' => $_POST['father_occupation'],
            'mother_name' => $_POST['mother_name'],
            'mother_occupation' => $_POST['mother_occupation'],

        ]);

        if ($insertID) {

            $insertToCollege = $model->insertToCollege([
                'old_id' => $_POST['row_id'],
                'scholarship_id' => $insertID,
                'app_year_number' => $_POST['app_year_number'],
                'app_id_number' => $_POST['app_id_number'],
                'app_sem_number' => $_POST['app_sem_number'],
                'ctc' => $_POST['ctc'],
                'availment' => $_POST['availment'],
                'school' => $_POST['school'],
                'course' => $_POST['course'],
                'unit' => $_POST['unit'],
                'year_level' => $_POST['year_level'],
                'semester' => $_POST['semester'],
                'school_year' => $_POST['school_year'],
                'app_status' => $_POST['app_status'], 

            ]);
        }


        $this->response($insertToCollege, RestController::HTTP_OK);
    }

    function getFirstLetters($str)
    {
        $words = explode(' ', ucwords($str)); // Capitalize each word and split into an array
        $firstLetters = array_map(function ($word) {
            return substr($word, 0, 1); // Get the first letter of each word
        }, $words);

        return implode('', $firstLetters); // Combine the first letters into a single string
    }

    public function bulk_delete_get()
    {

        $model = new ScholarModel;
        $result = $model->bulk_delete();

        $this->response($result, RestController::HTTP_OK);

    }


}
 