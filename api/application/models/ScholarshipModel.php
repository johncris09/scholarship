<?php

defined('BASEPATH') or exit ('No direct script access allowed');

class ScholarshipModel extends CI_Model
{

    function getCurrentApplicant()
    {

        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->row();
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->row();


        $query1 = "
            SELECT
                scholarship.*,
                barangay.id AS barangay_id,
                barangay.barangay address,
                'seniorhigh' as scholarship_type    
            FROM
                `senior_high`,
                scholarship,
                barangay
            WHERE
                senior_high.semester = '$query_sem->current_semester'
                AND senior_high.school_year = '$query_sy->current_sy'
                AND senior_high.scholarship_id = scholarship.id
                AND scholarship.address = barangay.id ";

        $query2 = "
            SELECT
                scholarship.*,
                barangay.id AS barangay_id,
                barangay.barangay address,
                'college' as scholarship_type
            FROM
                `college`,
                scholarship,
                barangay
            WHERE
                college.semester = '$query_sem->current_semester'
                AND college.school_year = '$query_sy->current_sy'
                AND college.scholarship_id = scholarship.id
                AND scholarship.address = barangay.id ";
        $query3 = "
                SELECT
                    scholarship.*,
                    barangay.id AS barangay_id,
                    barangay.barangay address,
                    'tvet' as scholarship_type
                FROM
                    `tvet`,
                    scholarship,
                    barangay
                WHERE
                    tvet.semester = '$query_sem->current_semester'
                    AND tvet.school_year = '$query_sy->current_sy'
                    AND tvet.scholarship_id = scholarship.id
                    AND scholarship.address = barangay.id ";

        $query = $this->db->query("$query1 UNION $query2   UNION $query3 ORDER BY  lastname, firstname ASC");

        return $query->result();

    }


    function getAll()
    {

        $query = "
            SELECT
                scholarship.*,
                barangay.id AS barangay_id,
                barangay.barangay address
            FROM 
                scholarship,
                barangay
            WHERE    scholarship.address = barangay.id
            ORDER BY
                lastname, firstname ASC ";
        $query = $this->db->query($query);
        return $query->result();

    }



    function get_applicant_by_status($data)
    {
        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->row();
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->row();

        $this->db->select('scholarship.*, 
        strand.strand,
        senior_high.grade_level,
        senior_high.school_year,
        senior_high.semester,
        senior_high.app_status,
        barangay.id AS barangay_id, barangay.barangay AS address');
        $this->db->from('senior_high');
        $this->db->join('scholarship', 'senior_high.scholarship_id = scholarship.id');
        $this->db->join('barangay', 'scholarship.address = barangay.id');
        $this->db->where('senior_high.school', $data['school']);
        $this->db->where('senior_high.semester', $query_sem->current_semester);
        $this->db->where('senior_high.school_year', $query_sy->current_sy);
        $this->db->join('strand', 'senior_high.strand = strand.id', 'LEFT');

        if ($data['app_status'] == 'approved') {
            $this->db
                ->like('senior_high.app_status', 'approved', 'both')
                ->where('senior_high.app_status !=', 'disapproved');
        } else {
            $this->db->where($data);
        }


        $this->db->order_by('lastname, firstname', 'ASC');

        $query = $this->db->get();
        return $query->result();


    }

    public function get($id)
    {
        $query = "    
            SELECT
                s.*,
                b.id AS barangay_id,
                b.barangay address
            FROM
                `scholarship` s
            LEFT JOIN barangay b ON
                s.address = b.id 
            where s.id = " . $id;

        $query = $this->db->query($query);
        return $query->row();
    }


    public function getApplicationDetails($id)
    {
        $this->db->select('
            c.id,
            c.scholarship_id,
            c.app_year_number,
            c.app_id_number,
            c.app_sem_number,
            c.ctc,
            c.availment,
            cs.school,
            course.course,
            c.unit,
            c.year_level,
            c.semester,
            c.school_year,
            c.app_status,
            c.app_status,
            "College" AS scholarship_type,
            cs.id as school_id,
            course.id as course_id'
        );
        $this->db->from('college c');
        $this->db->join('college_school cs', 'c.school = cs.id', 'LEFT');
        $this->db->join('course', 'c.course = course.id', 'LEFT');
        $this->db->where('c.scholarship_id', $id);

        $query1 = $this->db->get_compiled_select();

        $this->db->select('
            sh.id,
            sh.scholarship_id,
            sh.app_year_number,
            sh.app_id_number,
            sh.app_sem_number,
            sh.ctc,
            sh.availment,
            s.school,
            strand.strand AS course,
            "" AS unit,
            sh.grade_level AS year_level,
            sh.semester,
            sh.school_year,
            sh.app_status,
            sh.app_status,
            "Senior High" AS scholarship_type,
            s.id as school_id,
            strand.id as course_id'
        );
        $this->db->from('senior_high sh');
        $this->db->join('senior_high_school s', 'sh.school = s.id', 'LEFT');
        $this->db->join('strand', 'sh.strand = strand.id', 'LEFT');
        $this->db->where('sh.scholarship_id', $id);

        $query2 = $this->db->get_compiled_select();

        $this->db->select('
            t.id,
            t.scholarship_id,
            t.app_year_number,
            t.app_id_number,
            t.app_sem_number,
            t.ctc,
            t.availment,
            ts.school,
            tc.course,
            t.hour_number AS unit,
            t.year_level,
            t.semester,
            t.school_year,
            t.app_status,
            t.app_status,
            "Tvet" AS scholarship_type,
            ts.id as school_id,
            tc.id as course_id'
        );
        $this->db->from('tvet t');
        $this->db->join('tvet_school ts', 't.school = ts.id', 'LEFT');
        $this->db->join('tvet_course tc', 't.course = tc.id', 'LEFT');
        $this->db->where('t.scholarship_id', $id);

        $query3 = $this->db->get_compiled_select();

        $query = $this->db->query("$query1 UNION $query2 UNION $query3 ORDER BY school_year desc ,app_year_number desc , semester asc ");

        return $query->result();
    }

    public function update($id, $data)
    {
        $this->db->where('id', $id);
        return $this->db->update('scholarship', $data);
    }

    public function verify($data)
    {

        $query = "    
            SELECT
                s.*,
                b.id AS barangay_id,
                b.barangay address
            FROM
                `scholarship` s
            LEFT JOIN barangay b ON
                s.address = b.id ";


        if ($data['verify_by'] == "name") {
            $query .= " where CONCAT(lastname, ', ', firstname , ' ',  middlename) like '%" . $data['search_value'] . "%' ";

        } else {
            $query .= " where " . $data['verify_by'] . " like '%" . $data['search_value'] . "%' ";
        }
        $query .= " order by s.lastname asc, s.firstname asc";
        $query = $this->db->query($query);
        return $query->result();

    }

    public function insertNewApplicant($data)
    {

        $this->db->insert('scholarship', $data);
        return $this->db->insert_id();
    }


    function get_sibling() // current
    {

        $query_sem = $this->db->query('SELECT current_semester FROM  config where id = 1')->row();
        $query_sy = $this->db->query('SELECT current_sy FROM  config where id = 1')->row();
        $this->db
            ->select('  scholarship.*, "senior_high" as scholarship_type')
            ->from('senior_high, scholarship  ')
            ->where('senior_high.scholarship_id  = scholarship.id')
            ->where('senior_high.semester', $query_sem->current_semester)
            ->where('senior_high.school_year', $query_sy->current_sy)
        ;
        $query1 = $this->db->get_compiled_select();
        $this->db
            ->select('  scholarship.*, "college" as scholarship_type')
            ->from('college, scholarship  ')
            ->where('college.scholarship_id  = scholarship.id')
            ->where('college.semester', $query_sem->current_semester)
            ->where('college.school_year', $query_sy->current_sy)
        ;
        $query2 = $this->db->get_compiled_select();
        $this->db
            ->select('  scholarship.*, "tvet" as scholarship_type')
            ->from('tvet, scholarship  ')
            ->where('tvet.scholarship_id  = scholarship.id')
            ->where('tvet.semester', $query_sem->current_semester)
            ->where('tvet.school_year', $query_sy->current_sy)
        ;
        $query3 = $this->db->get_compiled_select();

        $query = "
            SELECT DISTINCT  
                id,
                lastname,
                firstname,
                middlename,
                suffix,
                father_name,
                mother_name,
                scholarship_type
            FROM (
                $query1 UNION $query2 UNION $query3
            ) AS all_scholarships  
            ORDER BY lastname, firstname ASC ";


        $query = $this->db->query($query);
        return $query->result();
    }
    function get_all_sibling()
    {

        $query = "
            SELECT DISTINCT
                a1.lastname  ,
                a1.firstname ,
                a1.middlename ,
                a1.suffix ,
                a1.address , 
                a1.father_name  ,
                a1.mother_name  
            FROM
                scholarship a1
            JOIN scholarship a2 ON
                a1.father_name = a2.father_name and a1.mother_name = a2.mother_name
            LEFT JOIN senior_high sh ON
                a1.id = sh.scholarship_id
            LEFT JOIN college c ON
                a1.id = c.scholarship_id
            LEFT JOIN tvet t ON
                a1.id = t.scholarship_id
            WHERE
                a1.id <> a2.id   
            order by a1.lastname, a1.firstname, a1.middlename asc
             ";
        $query = $this->db->query($query);
        return $query->result();

    }

    function filter_sibling($data)
    {
        $query = "
            SELECT DISTINCT
                a1.lastname  ,
                a1.firstname ,
                a1.middlename ,
                a1.suffix ,
                a1.address , 
                a1.father_name  ,
                a1.mother_name  
            FROM
                scholarship a1
            JOIN scholarship a2 ON
                a1.father_name = a2.father_name and a1.mother_name = a2.mother_name
            LEFT JOIN senior_high sh ON
                a1.id = sh.scholarship_id
            LEFT JOIN college c ON
                a1.id = c.scholarship_id
            LEFT JOIN tvet t ON
                a1.id = t.scholarship_id
            WHERE
                a1.id <> a2.id  
            AND sh.semester = '" . $data['semester'] . "' 
            AND c.semester = '" . $data['semester'] . "' 
            AND t.semester = '" . $data['semester'] . "' 
            AND sh.school_year = '" . $data['school_year'] . "' 
            AND c.school_year = '" . $data['school_year'] . "' 
            AND t.school_year = '" . $data['school_year'] . "'
            order by a1.lastname, a1.firstname, a1.middlename asc
             ";
        $query = $this->db->query($query);
        return $query->result();
    }
}


