<?php

defined('BASEPATH') or exit('No direct script access allowed');

class ScholarModel extends CI_Model
{



    // consolidate senior high
    function seniorHigh()
    {
        $query = "SELECT * FROM `table_scholarregistration` order by applastname";


        $query = $this->db->query($query);
        $result = $query->result_array();
        $data = [];
        $count = 0;
        foreach ($result as $row) {
            // magkalingaw og update hantod wala nay ma bilin


            $q = "SELECT * FROM `scholarship` where firstname = '" . $row['AppFirstName'] . "' and lastname ='" . $row['AppLastName'] . "' ";

            $q = $this->db->query($q);

            if ($q->num_rows() > 0) {

                $school = "select * from senior_high_school where abbreviation  = '" . $row['AppSchool'] . "'";
                $school = $this->db->query($school);


                $strand = "select * from strand where strand  = '" . $row['AppCourse'] . "'";
                $strand = $this->db->query($strand);




                $data['found'][] = [

                    'scholarship_id' => $q->row()->id,
                    'insert' => str_replace(["\n", "\r, \t", "  "], '', "
                        INSERT INTO `senior_high` (
                            `old_id`,
                            `scholarship_id`,
                            `app_year_number`,
                            `app_id_number`,
                            `app_sem_number`,
                            `ctc`,
                            `availment`,
                            `school`,
                            `strand`,
                            `grade_level`,
                            `semester`,
                            `school_year`,
                            `app_status`) VALUES 
                        (
                            " . $row['ID'] . ", 
                            " . $q->row()->id . ",   
                            " . $row['AppNoYear'] . ", 
                            " . $row['AppNoID'] . ", 
                            " . $row['AppNoSem'] . ", 
                            " . $row['AppCTC'] . ", 
                            " . $row['AppAvailment'] . ",   
                            " . $school->row()->id . ",      
                            " . $strand->row()->id . ",    
                            '" . $row['AppYear'] . "',  
                            '" . $row['AppSem'] . "',  
                            '" . $row['AppSY'] . "',  
                        '" . $row['AppStatus'] . "' 
                        ) ; "),
                    'update' => str_replace(["\n", "\r, \t", "  "], '', " UPDATE `table_scholarregistration` SET `remark` = 'checked' WHERE ID = " . $row['ID'] . "; "),
                    $row
                ];
            } else {

                $data['nofound'][] = $row;

            }
        }

        return $data;

    }

    function seniorHighNotChecked()
    {
        $query = "SELECT * FROM `table_scholarregistration` 
        where remark = 'not checked'
        order by applastname limit 50";


        $query = $this->db->query($query);
        $result = $query->result_array();
        return $result;
        $data = [];
        $count = 0;
        foreach ($result as $row) {
            // magkalingaw og update hantod wala nay ma bilin


            $q = "SELECT * FROM `scholarship` where   lastname ='" . $row['AppLastName'] . "'
            order by lastname, firstname asc ";

            $q = $this->db->query($q);
            $data[] = $row;
        }

        return $data;

    }

    function seniorHighMatchedToNewData()
    {
        $query = "SELECT * FROM `table_scholarregistration` 
        where remark = 'not checked'
        order by applastname  limit 50";


        $query = $this->db->query($query);
        $result = $query->result_array();

        $data = [];
        $count = 0;
        foreach ($result as $row) {
            // magkalingaw og update hantod wala nay ma bilin


            $q = "SELECT * FROM `scholarship` where   lastname ='" . $row['AppLastName'] . "' ";

            $q = $this->db->query($q);


            $data[] = $q->result();
        }

        return $data;

    }


    // consolidate senior high
    function college()
    {
        $query = "SELECT * FROM `table_collegeapp` order by colLastName";


        $query = $this->db->query($query);
        $result = $query->result_array();
        $data = [];
        $count = 0;
        foreach ($result as $row) {
            // magkalingaw og update hantod wala nay ma bilin


            $q = "SELECT * FROM `scholarship` where firstname = '" . $row['colFirstName'] . "'
             and lastname ='" . $row['colLastName'] . "' ";

            $q = $this->db->query($q);

            if ($q->num_rows() > 0) {
                $school = "select * from college_school where school  = '" . $row['colSchool'] . "'";
                $school = $this->db->query($school);

                $data[] = $row['colSchool'] ;

                $course = "select * from course where course  = '" . $row['colCourse'] . "'";
                $course = $this->db->query($course);
 

                // $data['found'][] = [ 
                //     'scholarship_id' => $q->row()->id,
                //     'insert' => str_replace(["\n", "\r, \t", "  "], '', "
                //         INSERT INTO `college`( 
                //             `old_id`,
                //             `scholarship_id`,
                //             `app_year_number`,
                //             `app_id_number`,
                //             `app_sem_number`,
                //             `ctc`,
                //             `availment`,
                //             `school`,
                //             `course`,
                //             `unit`,
                //             `year_level`,
                //             `semester`,
                //             `school_year`,
                //             `app_status`
                //         )
                //         VALUES( 
                //             " . $row['ID'] . ", 
                //             " . $q->row()->id . ",   
                //             " . $row['colAppNoYear'] . ",  
                //             " . $row['colAppNoID'] . ",  
                //             " . $row['colAppNoSem'] . ",  
                //             " . $row['colCTC'] . ",    
                //             " . $row['colAvailment'] . ",    
                //             " . $school->row()->id . ",   
                //             " . $course->row()->id . ",  
                //             " . $row['colUnits'] . " , 
                //             '" . $row['colYearLevel'] . "', 
                //             '" . $row['colSem'] . "', 
                //             '" . $row['colSY'] . "', 
                //             '" . $row['colAppStat'] . "'
                //         );"),
                //     'update' => str_replace(["\n", "\r, \t", "  "], '', " UPDATE `table_collegeapp` SET `remark` = 'checked' WHERE ID = " . $row['ID'] . "; "),
                //     $row
                // ];
            } else { 
 
                // $data['nofound'][] = $row;

            }
        }

        return $data;

    }

    function collegeNotChecked()
    {
        $query = "SELECT * FROM `table_collegeapp` 
        where remark = 'not checked'
        order by colLastName limit 50";


        $query = $this->db->query($query);
        $result = $query->result_array();
        return $result;
        $data = [];
        $count = 0;
        foreach ($result as $row) {
            // magkalingaw og update hantod wala nay ma bilin


            $q = "SELECT * FROM `scholarship` where   lastname ='" . $row['colLastName'] . "'
            order by lastname, firstname asc ";

            $q = $this->db->query($q);
            $data[] = $row;
        }

        return $data;

    }

    function collegeMatchedToNewData()
    {
        $query = "SELECT * FROM `table_collegeapp` 
        where remark = 'not checked'
        order by colLastName  limit 50";


        $query = $this->db->query($query);
        $result = $query->result_array();

        $data = [];
        $count = 0;
        foreach ($result as $row) {
            // magkalingaw og update hantod wala nay ma bilin


            $q = "SELECT * FROM `scholarship` where   lastname ='" . $row['colLastName'] . "' ";

            $q = $this->db->query($q);


            $data[] = $q->result();
        }

        return $data;

    }


    function getAll()
    {
        $query = "
            SELECT
                id,
                NAME,
                firstname,
                lastname,
                middlename,
                suffix,
                address,
                birthdate,
                civil_status,
                sex,
                contact_number,
                email_address,
                father_name,
                father_occupation,
                mother_name,
                mother_occupation
            FROM
                (
                    SELECT
                        id,
                        CONCAT(colLastName, ', ', colFirstName) AS NAME,
                        colFirstName AS firstname,
                        colLastName AS lastname,
                        colmi AS middlename,
                        colSuffix AS suffix,
                        colAddress AS address,
                        coldob AS birthdate,
                        colCivilStat AS civil_status,
                        colGender AS sex,
                        colContactNo AS contact_number,
                        colEmailAdd AS email_address,
                        colFathersName father_name,
                        colFatherOccu father_occupation,
                        colMothersName mother_name,
                        colMotherOccu mother_occupation
                    FROM
                        table_collegeapp
                    WHERE
                        colSY != 'SY: 2023-2024' AND CONCAT(colLastName, ', ', colFirstName) != ', '
                    GROUP BY NAME
                    UNION
                    SELECT
                        id,
                        CONCAT(AppLastName, ', ', AppFirstName) AS NAME,
                        AppFirstName AS firstname,
                        AppLastName AS lastname,
                        AppMidIn AS middlename,
                        AppSuffix AS suffix,
                        AppAddress AS address,
                        AppDOB AS birthdate,
                        AppCivilStat AS civil_status,
                        AppGender AS sex,
                        AppContact AS contact_number,
                        AppEmailAdd AS email_address,
                        AppFirstName AS father_name,
                        AppFatherOccu AS father_occupation,
                        AppMother AS mother_name,
                        AppMotherOccu mother_occupation
                    FROM
                        table_scholarregistration
                    WHERE
                        appsy != 'SY: 2023-2024' AND CONCAT(AppLastName, ', ', AppFirstName) != ', '
                    GROUP BY NAME
                    UNION
                    SELECT
                        id,
                        CONCAT(colLastName, ', ', colFirstName) AS NAME,
                        colFirstName AS firstname,
                        colLastName AS lastname,
                        colmi AS middlename,
                        colSuffix AS suffix,
                        colAddress AS address,
                        coldob AS birthdate,
                        colCivilStat AS civil_status,
                        colGender AS sex,
                        colContactNo AS contact_number,
                        colEmailAdd AS email_address,
                        colFathersName father_name,
                        colFatherOccu father_occupation,
                        colMothersName mother_name,
                        colMotherOccu mother_occupation
                    FROM
                        table_tvet
                    WHERE
                        colSY != 'SY: 2023-2024' AND CONCAT(colLastName, ', ', colFirstName) != ', '
                    GROUP BY NAME
            ) AS combined_data
            GROUP BY NAME
            ORDER BY NAME ASC
            limit 10

        ";
        $query = $this->db->query($query);
        return $query->result();

    }

    function getAllScholarship()
    {

        $query = "
            SELECT
                *    
            FROM
                scholarship 


        ";

        $query = $this->db->query($query);
        return $query->result();
    }

    function getAppDetails($name)
    {

        $query = "
            SELECT
                id,
                colAppNoYear AS app_year_number,
                colAppNoID AS app_id_number,
                colAppNoSem AS app_sem_number,
                colCTC AS ctc,
                colAvailment AS availment,
                colSchool AS school,
                colCourse AS course,
                colUnits AS unit,
                colYearLevel AS year_level,
                colSem AS semester,
                colSY AS school_year,
                colAppStat AS app_status,
                'college' AS scholarship_type
            FROM
                table_collegeapp
            WHERE
                CONCAT(colLastName, ' ', colFirstName) = '" . $name . "' AND colSY != 'SY: 2023-2024'
            UNION
                -- SENIOR HIGH
            SELECT
                id,
                AppNoYear AS app_year_number,
                AppNoID AS app_id_number,
                AppNoSem AS app_sem_number,
                AppCTC AS ctc,
                AppAvailment AS availment,
                AppSchool AS school,
                AppCourse AS course,
                '' AS unit,
                AppYear AS year_level,
                AppSem AS semester,
                AppSY AS school_year,
                AppStatus AS app_status,
                'senior high' AS scholarship_type
            FROM
                table_scholarregistration
            WHERE
                CONCAT(AppLastName, ' ', AppFirstName) = '" . $name . "' AND appsy != 'SY: 2023-2024'
            UNION
                -- TVET
            SELECT
                id,
                colAppNoYear AS app_year_number,
                colAppNoID AS app_id_number,
                colAppNoSem AS app_sem_number,
                colCTC AS ctc,
                colAvailment AS availment,
                colSchool AS school,
                colCourse AS course,
                colUnits AS unit,
                colYearLevel AS year_level,
                colSem AS semester,
                colSY AS school_year,
                colAppStat AS app_status,
                'tvet' AS scholarship_type
            FROM
                table_tvet
            WHERE
                CONCAT(colLastName, ' ', colFirstName) = '" . $name . "' AND colSY != 'SY: 2023-2024'
            ORDER BY
                school_year ASC,
                semester ASC,
                app_year_number ASC
        ";

        $query = $this->db->query($query);
        return $query->result();

    }


    public function search($data)
    {

        $sql = "
        SELECT
            id,
            AppFirstName AS firstname,
            AppLastName AS lastname,
            AppMidIn AS middlename,
            'Senior High' AS scholarship,
            AppNoYear as appnoyear,
            AppNoID as appnoid,
            AppNoSem as appnosem, 
            AppContact as contact_number,
            AppAddress as address,
            AppGender as gender,
            AppSchool as school,
            AppCourse as course,
            AppSY as school_year,
            AppSem as semester,  
            AppStatus as status,
            AppAvailment as availment
        FROM
            table_scholarregistration
        WHERE
            CONCAT(
                AppFirstName,
                ' ',
                AppLastName,
                ' ',
                AppMidIn
            ) LIKE ?
        UNION
        SELECT
            id,
            colFirstName AS firstname,
            colLastName AS lastname,
            colMI AS middlename,
            'College' AS scholarship,
			colAppNoYear as appnoyear,
			colAppNoID as appnoid,
			colAppNoSem as appnosem, 
            colContactNo as contact_number,
            colAddress as address,
            colGender as gender,
            colSchool as school,
            colCourse as course,
            colSY as school_year,
            colSem as semester,   
            colAppStat as status,
            colAvailment as availment
        FROM
            table_collegeapp
        WHERE
            CONCAT(
                colFirstName,
                ' ',
                colLastName,
                ' ',
                colMI
            ) LIKE ?
        UNION
        SELECT
            id,
            colFirstName AS firstname,
            colLastName AS lastname,
            colMI AS middlename,
            'Tvet' AS scholarship,
			colAppNoYear as appnoyear,
			colAppNoID as appnoid,
			colAppNoSem as appnosem, 
            colContactNo as contact_number,
            colAddress as address,
            colGender as gender,
            colSchool as school,
            colCourse as course,
            colSY as school_year,
            colSem as semester,  
            colAppStat as status,
            colAvailment as availment
        FROM
            table_tvet
        WHERE
            CONCAT(
                colFirstName,
                ' ',
                colLastName,
                ' ',
                colMI
            ) LIKE ?
        ORDER BY
            lastname
            ";

        $query = $this->db->query($sql, array("%$data%", "%$data%", "%$data%"));
        return $query->result();
    }




    public function bulk_delete()
    {
        $this->db->where('appnoyear', 0);
        $this->db->delete('table_scholarregistration');


        // Return the query object
        return $this->db->last_query();
    }

    public function insertToNewRecord($data)
    {
        $this->db->insert('scholarship', $data);
        return $this->db->insert_id();
    }
    public function insertToSeniorHigh($data)
    {
        $this->db->insert('senior_high', $data);
        // return $this->db->insert_id();

        return $this->updateOldSeniorHighTable($data['old_id']);

    }

    public function updateOldSeniorHighTable($id)
    {

        $this->db->where('id', $id);
        return $this->db->update('table_scholarregistration', ['remark' => 'checked']);
    }



    public function insertToCollege($data)
    {
        $this->db->insert('college', $data); 
        return $this->updateOldCollegeTable($data['old_id']);

    }
    public function updateOldCollegeTable($id)
    {

        $this->db->where('id', $id);
        return $this->db->update('table_collegeapp', ['remark' => 'checked']);
    }


    public function insert($data)
    {
        return $this->db->insert('scholarship', $data);
    }

    function insertToTable($table, $data)
    {
        return $this->db->insert($table, $data);
    }

    function getBarangay()
    {

        $query = "
        SELECT *
        FROM
            `barangay` 
        ";

        $query = $this->db->query($query);
        return $query->result();
    }

    function getSeniorHighSchool()
    {

        $query = "
            SELECT * 
            FROM senior_high_school as s, barangay a
            where s.address = a.id
            
        ";

        $query = $this->db->query($query);
        return $query->result();
    }

    function getCollegeSchool()
    {

        // $query = "
        //     SELECT
        //         school
        //     FROM
        //         `college`
        //     GROUP BY
        //         school
        //     ORDER BY
        //         `college`.`school` ASC

        // ";

        $query = "
            SELECT
                *
            FROM
                college_school  
                
        ";


        $query = $this->db->query($query);
        return $query->result();
    }




    function getStrand()
    {

        $query = "
        SELECT * FROM `strand`
        ";

        $query = $this->db->query($query);
        return $query->result();
    }

    public function updateAddress($address, $data)
    {
        $this->db->where('address', $address);
        return $this->db->update('scholarship', $data);
    }

    public function updateCollegeSchool($school, $data)
    {
        $this->db->where('school', $school);
        return $this->db->update('college', $data);
    }


    public function updateCollege($id, $data)
    {
        $this->db->where('id', $id);
        return $this->db->update('college', $data);
    }


    public function updateStrand($strand, $data)
    {
        $this->db->where('strand', $strand);
        return $this->db->update('senior_high', $data);
    }



    function getAllCollege($id)
    {


        $query = "
            SELECT * FROM `college`  
            where scholarship_id = $id
            and school like 'BSEd - English'
        ";

        $query = $this->db->query($query);
        return $query->result();
    }

    function getCourse()
    {

        $query = "
            SELECT * FROM `course`
        ";

        $query = $this->db->query($query);
        return $query->result();
    }

    function getCollegeCourse()
    {

        // $query = "
        //     SELECT course FROM `college` GROUP by course  
        //     ORDER BY `college`.`course` ASC

        // ";

        $query = "
            SELECT
                *
            FROM
                course 
        ";


        $query = $this->db->query($query);
        return $query->result();
    }

    public function updateCourse($course, $data)
    {
        $this->db->where('course', $course);
        return $this->db->update('college', $data);
    }

}