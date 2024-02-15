<?php

defined('BASEPATH') or exit('No direct script access allowed');

class SeniorHighModel extends CI_Model
{

    public $table = 'senior_high';

    public function insert($data)
    {
        return $this->db->insert($this->table, $data);
    }


    public function get_by_status($data)
    {
        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->row();
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->row();

        $this->db
            ->select('
                `sh`.`id`,
				scholarship.reference_number,
				sh.scholarship_id,
                scholarship.lastname,
                scholarship.firstname,
                scholarship.middlename,
                scholarship.suffix,
                scholarship.contact_number,
                barangay.barangay AS address,
                scholarship.sex,
                `sh`.`app_year_number`,
                `sh`.`app_id_number`,
                `sh`.`app_sem_number`,
                `sh`.`ctc`,
                `sh`.`availment`,
                `s`.`school`,
                `strand`.`strand`,
                `sh`.`grade_level`,
                `sh`.`semester`,
                `sh`.`school_year`,
                `sh`.`app_status`,
                `sh`.`reason`,
                barangay.id AS barangay_id,
                s.id AS senior_high_school_id,
                strand.id AS strand_id')
            ->from('senior_high sh')
            ->join('scholarship', 'sh.scholarship_id = scholarship.id', 'LEFT')
            ->join('barangay', 'scholarship.address = barangay.id', 'LEFT')
            ->join('senior_high_school s', 'sh.school = s.id', 'LEFT')
            ->join('strand', 'sh.strand = strand.id', 'LEFT')
            ->where('sh.semester', $query_sem->current_semester)
            ->where('sh.school_year', $query_sy->current_sy)
            ->order_by('sh.id', 'desc');

        if ($data['app_status'] == 'approved') {
            $this->db->like('sh.app_status', 'approved', 'both')
                ->where('sh.app_status !=', 'disapproved');
        } else {
            $this->db->where($data);
        }

        $query = $this->db->get();
        return $query->result();
    }





    public function get_all_by_status($data)
    {
        $this->db
            ->select('
            `sh`.`id`,
            scholarship.reference_number,
            sh.scholarship_id,
            scholarship.lastname,
            scholarship.firstname,
            scholarship.middlename,
            scholarship.suffix,
            scholarship.contact_number,
            barangay.barangay AS address,
            scholarship.sex,
            `sh`.`app_year_number`,
            `sh`.`app_id_number`,
            `sh`.`app_sem_number`,
            `sh`.`ctc`,
            `sh`.`availment`,
            `s`.`school`,
            `strand`.`strand`,
            `sh`.`grade_level`,
            `sh`.`semester`,
            `sh`.`school_year`,
            `sh`.`app_status`,
            barangay.id AS barangay_id,
            s.id AS senior_high_school_id,
            strand.id AS strand_id')
            ->from('senior_high sh')
            ->join('scholarship', 'sh.scholarship_id = scholarship.id', 'LEFT')
            ->join('barangay', 'scholarship.address = barangay.id', 'LEFT')
            ->join('senior_high_school s', 'sh.school = s.id', 'LEFT')
            ->join('strand', 'sh.strand = strand.id', 'LEFT')
            ->order_by('sh.id', 'desc');

        if ($data['app_status'] == 'approved') {
            $this->db
                ->like('sh.app_status', 'approved', 'both')
                ->where('sh.app_status !=', 'disapproved');
        } else {
            $this->db->where($data);
        }

        $query = $this->db->get();
        return $query->result();
    }



    public function filter_by_status($data)
    {
        $this->db
            ->select('
            `sh`.`id`,
            scholarship.reference_number,
            sh.scholarship_id,
            scholarship.lastname,
            scholarship.firstname,
            scholarship.middlename,
            scholarship.suffix,
            scholarship.contact_number,
            barangay.barangay AS address,
            scholarship.sex,
            `sh`.`app_year_number`,
            `sh`.`app_id_number`,
            `sh`.`app_sem_number`,
            `sh`.`ctc`,
            `sh`.`availment`,
            `s`.`school`,
            `strand`.`strand`,
            `sh`.`grade_level`,
            `sh`.`semester`,
            `sh`.`school_year`,
            `sh`.`app_status`,
            barangay.id AS barangay_id,
            s.id AS senior_high_school_id,
            strand.id AS strand_id')
            ->from('senior_high sh')
            ->join('scholarship', 'sh.scholarship_id = scholarship.id', 'LEFT')
            ->join('barangay', 'scholarship.address = barangay.id', 'LEFT')
            ->join('senior_high_school s', 'sh.school = s.id', 'LEFT')
            ->join('strand', 'sh.strand = strand.id', 'LEFT')
            ->order_by('sh.id', 'desc');

        if ($data['app_status'] == 'approved') {
            $this->db
                ->like('sh.app_status', 'approved', 'both')
                ->where('sh.app_status !=', 'disapproved')
                ->where('sh.school_year', $data['school_year'])
                ->where('sh.semester', $data['semester']);
        } else {
            $this->db->where($data);
        }

        $query = $this->db->get();

        return $query->result();
    }

    public function update($id, $data)
    {
        $this->db->where('id', $id);
        return $this->db->update($this->table, $data);
    }

    public function bulk_status_update($data, $id)
    { 
        $this->db->where_in('id', $id);
        return $this->db->update($this->table, $data);

    }


    public function total_pending($filterData)
    {

        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        $this->db->select('count(*) as total_pending')
            ->where('app_status', 'pending')
            ->where('semester', $query_sem->current_semester)
            ->where('school_year', $query_sy->current_sy);

        if (!empty($filterData['school'])) {
            $this->db->where('school', intval($filterData['school']));
        }
        $query = $this->db->get($this->table);

        return $query->result()[0];
    }




    public function total_approved($filterData)
    {


        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        $this->db->select('count(*) as total_approved')
            ->like('app_status', 'approved', 'both')
            ->where('app_status !=', 'disapproved')
            ->where('semester', $query_sem->current_semester)
            ->where('school_year', $query_sy->current_sy);


        if (!empty($filterData['school'])) {
            $this->db->where('school', intval($filterData['school']));
        }
        $query = $this->db->get($this->table);

        return $query->result()[0];
    }


    public function total_disapproved($filterData)
    {


        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        $this->db->select('count(*) as total_disapproved')
            ->where('app_status ', 'disapproved')
            ->where('semester', $query_sem->current_semester)
            ->where('school_year', $query_sy->current_sy);

        if (!empty($filterData['school'])) {
            $this->db->where('school', intval($filterData['school']));
        }
        $query = $this->db->get($this->table);

        return $query->result()[0];
    }


    public function total_archived($filterData)
    {


        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        $this->db->select('count(*) as total_archived')
            ->where('app_status ', 'archived')
            ->where('semester', $query_sem->current_semester)
            ->where('school_year', $query_sy->current_sy);
        if (!empty($filterData['school'])) {
            $this->db->where('school', intval($filterData['school']));
        }
        $query = $this->db->get($this->table);

        return $query->result()[0];
    }



    public function total_void()
    {

        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        $query = $this->db->select('count(*) as total_void')
            ->where('app_status ', 'void')
            ->where('semester', $query_sem->current_semester)
            ->where('school_year', $query_sy->current_sy)
            ->get($this->table);

        return $query->result()[0];
    }





    public function total($filterData)
    {

        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        $this->db->select('count(*) as total')
            ->where('semester', $query_sem->current_semester)
            ->where('school_year', $query_sy->current_sy);


        if (!empty($filterData['school'])) {
            $this->db->where('school', intval($filterData['school']));
        }


        $query = $this->db->get($this->table);
        $result = $query->row();
        return $result->total;


    }




    public function get_status_by_barangay($filterData)
    {


        $query = $this->db->query("select * from barangay");
        $addresses = $query->result();

        $data = array();
        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->result()[0];
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->result()[0];

        foreach ($addresses as $address) {


            $queryString = "
                SELECT
                    COUNT(
                        CASE WHEN sh.app_status LIKE '%approved%' AND sh.app_status != 'disapproved' AND s.address = $address->id THEN 1
                    END
                ) AS approved_count,
                COUNT(
                    CASE WHEN sh.app_status = 'Pending' AND s.address =  $address->id THEN 1
                END
                ) AS pending_count,
                COUNT(CASE WHEN sh.app_status = 'Disapproved' AND s.address = $address->id THEN 1 END) as disapproved_count
                FROM
                    `senior_high` AS sh,
                    scholarship AS s 
                WHERE
                    sh.scholarship_id = s.id AND sh.semester = '$query_sem->current_semester'  
                AND sh.school_year =   '$query_sy->current_sy' ";


            if (!empty($filterData['school'])) {
                $queryString .= " AND sh.school = " . intval($filterData['school']);
            }

            $query = $this->db->query($queryString);
            $result = $query->result();
            $data[] = array(
                'address' => $address->barangay,
                'approved' => $result[0]->approved_count,
                'pending' => $result[0]->pending_count,
                'disapproved' => $result[0]->disapproved_count,
            );
        }

        return $data;

    }



    public function filter_total_pending($data)
    {
        $query = $this->db->select('count(*) as total_pending')
            ->where('app_status', 'pending')
            ->where($data)

            ->get($this->table);
        return $query->result()[0];
    }


    public function filter_total_approved($data)
    {

        $query = $this->db->select('count(*) as total_approved')
            ->like('app_status', 'approved', 'both')
            ->where('app_status !=', 'disapproved')
            ->where($data)
            ->get($this->table);

        return $query->result()[0];
    }

    public function filter_total_disapproved($data)
    {


        $query = $this->db->select('count(*) as total_disapproved')
            ->where('app_status ', 'disapproved')
            ->where($data)
            ->get($this->table);

        return $query->result()[0];
    }

    public function filter_total_archived($data)
    {


        $query = $this->db->select('count(*) as total_archived')
            ->where('app_status ', 'archived')
            ->where($data)
            ->get($this->table);

        return $query->result()[0];
    }


    public function filter_total_void($data)
    {

        $query = $this->db->select('count(*) as total_void')
            ->where('app_status ', 'void')
            ->where($data)
            ->get($this->table);

        return $query->result()[0];
    }


    public function filter_status_by_barangay($filter_data)
    {

        $query = $this->db->query("select * from barangay");
        $addresses = $query->result();

        $data = array();
        foreach ($addresses as $address) {

            $queryString = "
                SELECT
                    COUNT(
                        CASE WHEN sh.app_status LIKE '%approved%' AND sh.app_status != 'disapproved' AND s.address = $address->id THEN 1
                    END
                ) AS approved_count,
                COUNT(
                    CASE WHEN sh.app_status = 'Pending' AND s.address =  $address->id THEN 1
                END
                ) AS pending_count,
                COUNT(CASE WHEN sh.app_status = 'Disapproved' AND s.address = $address->id THEN 1 END) as disapproved_count
                FROM
                    `senior_high` AS sh,
                    scholarship AS s 
                WHERE
                sh.scholarship_id = s.id  ";



            $queryString .= " and sh.semester = '" . $filter_data['semester'] . "' 
                and sh.school_year = '" . $filter_data['school_year'] . "'";

            $query = $this->db->query($queryString);
            $result = $query->result();
            $data[] = array(
                'address' => $address->barangay,
                'approved' => $result[0]->approved_count,
                'pending' => $result[0]->pending_count,
                'disapproved' => $result[0]->disapproved_count,
            );
        }

        return $data;

    }



    public function all_total_pending()
    {
        $query = $this->db->select('count(*) as total_pending')
            ->where('app_status', 'pending')

            ->get($this->table);
        return $query->result()[0];
    }

    public function all_total_approved()
    {


        $query = $this->db->select('count(*) as total_approved')
            ->like('app_status', 'approved', 'both')
            ->where('app_status !=', 'disapproved')
            ->get($this->table);

        return $query->result()[0];
    }
    public function all_total_disapproved()
    {


        $query = $this->db->select('count(*) as total_disapproved')
            ->where('app_status ', 'disapproved')
            ->get($this->table);

        return $query->result()[0];
    }

    public function all_total_archived()
    {


        $query = $this->db->select('count(*) as total_archived')
            ->where('app_status ', 'archived')
            ->get($this->table);

        return $query->result()[0];
    }
    public function all_total_void()
    {


        $query = $this->db->select('count(*) as total_void')
            ->where('app_status ', 'void')
            ->get($this->table);

        return $query->result()[0];
    }

    public function all_total()
    {
        $query = $this->db->select('count(*) as total')
            ->get($this->table);
        $result = $query->row();
        return $result->total;
    }



    public function all_status_by_barangay()
    {

        $query = $this->db->query("select * from barangay");
        $addresses = $query->result();

        $data = array();
        foreach ($addresses as $address) {

            $queryString = "
                SELECT
                    COUNT(
                        CASE WHEN sh.app_status LIKE '%approved%' AND sh.app_status != 'disapproved' AND s.address = $address->id THEN 1
                    END
                ) AS approved_count,
                COUNT(
                    CASE WHEN sh.app_status = 'Pending' AND s.address =  $address->id THEN 1
                END
                ) AS pending_count,
                COUNT(CASE WHEN sh.app_status = 'Disapproved' AND s.address = $address->id THEN 1 END) as disapproved_count
                FROM
                    `senior_high` AS sh,
                    scholarship AS s 
                WHERE
                sh.scholarship_id = s.id  ";



            $query = $this->db->query($queryString);
            $result = $query->result();
            $data[] = array(
                'address' => $address->barangay,
                'approved' => $result[0]->approved_count,
                'pending' => $result[0]->pending_count,
                'disapproved' => $result[0]->disapproved_count,
            );
        }

        return $data;

    }



    public function generate_report($data)
    {


        $this->db
            ->select('
            `sh`.`id`,
            scholarship.reference_number,
            sh.scholarship_id,
            scholarship.lastname,
            scholarship.firstname,
            scholarship.middlename,
            scholarship.suffix,
            scholarship.contact_number,
            barangay.barangay AS address,
            scholarship.sex,
            `sh`.`app_year_number`,
            `sh`.`app_id_number`,
            `sh`.`app_sem_number`,
            `sh`.`ctc`,
            `sh`.`availment`,
            `s`.`school`,
            `s`.`abbreviation`,
            `strand`.`strand`,
            `sh`.`grade_level`,
            `sh`.`semester`,
            `sh`.`school_year`,
            `sh`.`app_status`,
            barangay.id AS barangay_id,
            s.id AS senior_high_school_id,
            strand.id AS strand_id')
            ->from('senior_high sh')
            ->join('scholarship', 'sh.scholarship_id = scholarship.id', 'LEFT')
            ->join('barangay', 'scholarship.address = barangay.id', 'LEFT')
            ->join('senior_high_school s', 'sh.school = s.id', 'LEFT')
            ->join('strand', 'sh.strand = strand.id', 'LEFT');

        if (!empty($data)) {
            $this->db->where($data);
        }
        $this->db->order_by('lastname', 'asc');

        $query = $this->db->get();
        return $query->result();

    }



    // **************************************************************** 
    // **************************************************************** 
    // **************************************************************** 
    // **************************************************************** 
    // **************************************************************** 
    // ****************************************************************  
    // _______________
    // |             |
    // |  METHOD     |
    // |             |
    // ****************************************************************
    // ****************************************************************
    // ****************************************************************
    // ****************************************************************
    // ****************************************************************
    // ****************************************************************     

    public $default_column = '
        ID,
        AppNoYear,
        AppNoID,
        AppNoSem,
        AppStatus,
        AppFirstName,
        AppMidIn,
        AppLastName,
        AppSuffix,
        AppAddress,
        AppDOB,
        AppAge,
        AppCivilStat,
        AppGender,
        AppContact,
        AppCTC,
        AppEmailAdd,
        AppAvailment,
        AppSchool,
        AppCourse,
        AppSchoolAddress,
        AppYear,
        AppSem,
        AppSY,
        AppFather,
        AppFatherOccu,
        AppMother,
        AppMotherOccu,
        AppManager
    ';




    public function bulk_insert($data)
    {
        return $this->db->insert_batch($this->table, $data);

    }


    public function find($id)
    {
        $this->db->where('id', $id);
        $query = $this->db->get($this->table);
        return $query->row();
    }





    public function filter_total($data)
    {
        $query = $this->db->select('count(*) as total')
            ->where($data)
            ->get($this->table);
        $result = $query->row();
        return $result->total;
    }



    public function get_student()
    {
        $query = $this->db->select($this->default_column)
            ->where('AppManager', 'Active')
            ->order_by('id', 'desc')
            ->get($this->table);
        return $query->result();
    }
























}

