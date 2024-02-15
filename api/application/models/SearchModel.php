<?php

defined('BASEPATH') or exit('No direct script access allowed');

class SearchModel extends CI_Model
{

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
        ORDER BY id desc
            ";

        $query = $this->db->query($sql, array("%$data%", "%$data%", "%$data%"));
        return $query->result();
    }


}