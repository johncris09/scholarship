<?php
defined('BASEPATH') or exit('No direct script access allowed');


// ╭━━━┳━━━┳╮╱╭┳━━━┳╮╱╱╭━━━┳━━━┳━━━┳╮╱╭┳━━┳━━━╮
// ┃╭━╮┃╭━╮┃┃╱┃┃╭━╮┃┃╱╱┃╭━╮┃╭━╮┃╭━╮┃┃╱┃┣┫┣┫╭━╮┃
// ┃╰━━┫┃╱╰┫╰━╯┃┃╱┃┃┃╱╱┃┃╱┃┃╰━╯┃╰━━┫╰━╯┃┃┃┃╰━╯┃
// ╰━━╮┃┃╱╭┫╭━╮┃┃╱┃┃┃╱╭┫╰━╯┃╭╮╭┻━━╮┃╭━╮┃┃┃┃╭━━╯
// ┃╰━╯┃╰━╯┃┃╱┃┃╰━╯┃╰━╯┃╭━╮┃┃┃╰┫╰━╯┃┃╱┃┣┫┣┫┃
// ╰━━━┻━━━┻╯╱╰┻━━━┻━━━┻╯╱╰┻╯╰━┻━━━┻╯╱╰┻━━┻╯


$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;
$route['api/demo'] = 'api/ApiDemoController/index';



// User
$route['user'] = 'User/index';
$route['user'] = 'User/online';
$route['login'] = 'User/login';
$route['user/find/(:any)'] = 'User/find/$1';
$route['user/update_login_status'] = 'User/update_login_status';
$route['user/update/(:any)'] = 'User/update/$1';
$route['user/delete/(:any)'] = 'User/delete/$1';


// Search
// $route['search'] = 'Search';  
$route['advance_search'] = 'AdvanceSearch/find';

// Config
$route['config'] = 'Config/index';
$route['config/find/(:any)'] = 'Config/find/$1';
$route['config/update/(:any)'] = 'Config/update/$1';
$route['config/shs_appno'] = 'Config/shs_appno';
$route['config/college_appno'] = 'Config/college_appno';
$route['config/tvet_appno'] = 'Config/tvet_appno';

// System Sequence
$route['system_sequence'] = 'SystemSequence/index';
$route['system_sequence/find/(:any)'] = 'SystemSequence/find/$1';
$route['system_sequence/update/(:any)'] = 'SystemSequence/update/$1';
$route['system_sequence/shs_appno'] = 'SystemSequence/shs_appno';
$route['system_sequence/college_appno'] = 'SystemSequence/college_appno';
$route['system_sequence/tvet_appno'] = 'SystemSequence/tvet_appno';


// Senior High
$route['senior_high'] = 'SeniorHigh';
$route['senior_high/find/(:any)'] = 'SeniorHigh/find/$1';
$route['senior_high/insert'] = 'SeniorHigh/insert'; 
$route['senior_high/filter_approved'] = 'SeniorHigh/filter_approved';
$route['senior_high/get_by_status'] = 'SeniorHigh/get_by_status';
$route['senior_high/all_status_by_barangay'] = 'SeniorHigh/all_status_by_barangay';
$route['senior_high/filter_status_by_barangay'] = 'SeniorHigh/filter_status_by_barangay';
$route['senior_high/get_by_status'] = 'SeniorHigh/get_by_status';
$route['senior_high/get_all_by_status'] = 'SeniorHigh/get_all_by_status';
$route['senior_high/filter_by_status'] = 'SeniorHigh/filter_by_status';
$route['senior_high/total_status'] = 'SeniorHigh/total_status';
$route['senior_high/filter_total_status'] = 'SeniorHigh/filter_total_status';
$route['senior_high/all_total_status'] = 'SeniorHigh/all_total_status';
$route['senior_high/total'] = 'SeniorHigh/total';
$route['senior_high/filter_total'] = 'SeniorHigh/filter_total';
$route['senior_high/all_total'] = 'SeniorHigh/all_total';
$route['senior_high/get_status_by_barangay'] = 'SeniorHigh/get_status_by_barangay';
$route['senior_high/generate_report'] = 'SeniorHigh/generate_report';
$route['senior_high/update/(:any)'] = 'SeniorHigh/update/$1';
$route['senior_high/update_status/(:any)'] = 'SeniorHigh/update_status/$1';
$route['senior_high/bulk_status_update'] = 'SeniorHigh/bulk_status_update';
$route['senior_high/bulk_disapproved'] = 'SeniorHigh/bulk_disapproved';

// College
$route['college'] = 'College';
$route['college/select'] = 'College/select';
$route['college/find/(:any)'] = 'College/find/$1';
$route['college/insert'] = 'College/insert'; 
$route['college/filter_approved'] = 'College/filter_approved';
$route['college/get_by_status'] = 'College/get_by_status';
$route['college/all_status_by_barangay'] = 'College/all_status_by_barangay';
$route['college/filter_status_by_barangay'] = 'College/filter_status_by_barangay';
$route['college/get_by_status'] = 'College/get_by_status';
$route['college/get_all_by_status'] = 'College/get_all_by_status';
$route['college/filter_by_status'] = 'College/filter_by_status';
$route['college/total_status'] = 'College/total_status';
$route['college/filter_total_status'] = 'College/filter_total_status';
$route['college/all_total_status'] = 'College/all_total_status';
$route['college/total'] = 'College/total';
$route['college/filter_total'] = 'College/filter_total';
$route['college/all_total'] = 'College/all_total';
$route['college/get_status_by_barangay'] = 'College/get_status_by_barangay';
$route['college/generate_report'] = 'College/generate_report';
$route['college/update/(:any)'] = 'College/update/$1';
$route['college/update_status/(:any)'] = 'College/update_status/$1';
$route['college/bulk_status_update'] = 'College/bulk_status_update';
$route['college/bulk_disapproved'] = 'College/bulk_disapproved';


// Tvet
$route['tvet'] = 'Tvet';
$route['tvet/insert'] = 'Tvet/insert';
$route['tvet/find/(:any)'] = 'Tvet/find/$1'; 
$route['tvet/filter_approved'] = 'Tvet/filter_approved';
$route['tvet/get_by_status'] = 'Tvet/get_by_status';
$route['tvet/all_status_by_barangay'] = 'Tvet/all_status_by_barangay';
$route['tvet/filter_status_by_barangay'] = 'Tvet/filter_status_by_barangay';
$route['tvet/get_by_status'] = 'Tvet/get_by_status';
$route['tvet/get_all_by_status'] = 'Tvet/get_all_by_status';
$route['tvet/filter_by_status'] = 'Tvet/filter_by_status';
$route['tvet/total_status'] = 'Tvet/total_status';
$route['tvet/filter_total_status'] = 'Tvet/filter_total_status';
$route['tvet/all_total_status'] = 'Tvet/all_total_status';
$route['tvet/total'] = 'Tvet/total';
$route['tvet/filter_total'] = 'Tvet/filter_total';
$route['tvet/all_total'] = 'Tvet/all_total';
$route['tvet/get_status_by_barangay'] = 'Tvet/get_status_by_barangay';
$route['tvet/generate_report'] = 'Tvet/generate_report';
$route['tvet/update/(:any)'] = 'Tvet/update/$1';
$route['tvet/update_status/(:any)'] = 'Tvet/update_status/$1';
$route['tvet/bulk_status_update'] = 'Tvet/bulk_status_update';
$route['tvet/bulk_disapproved'] = 'Tvet/bulk_disapproved';








// Applicant
$route['applicant'] = 'Applicant/index';
$route['all_applicant'] = 'Applicant/getAll';
$route['get_applicant_by_status'] = 'Applicant/get_applicant_by_status';
$route['applicant/insert'] = 'Applicant/insert';
$route['applicant/insert_new_applicant'] = 'Applicant/insert_new_applicant';
$route['applicant/(:any)'] = 'Applicant/get/$1';
$route['applicant_details/(:any)'] = 'Applicant/getApplicationDetails/$1';
$route['verify'] = 'Applicant/verify';
$route['applicant/update/(:any)'] = 'Applicant/update/$1';
$route['applicant/update_photo/(:any)'] = 'Applicant/update_photo/$1';
$route['applicant/update_applicant_details/(:any)'] = 'Applicant/update_applicant_details/$1';
$route['sibling'] = 'Applicant/get_sibling';
$route['get_all_sibling'] = 'Applicant/get_all_sibling';
$route['filter_sibling'] = 'Applicant/filter_sibling';



// Tvet School
$route['tvet_school'] = 'TvetSchool/index';
$route['tvet_school/insert'] = 'TvetSchool/insert';
$route['tvet_school/find/(:any)'] = 'TvetSchool/find/$1';
$route['tvet_school/update/(:any)'] = 'TvetSchool/update/$1';
$route['tvet_school/delete/(:any)'] = 'TvetSchool/delete/$1';
$route['tvet_school/bulk_delete'] = 'TvetSchool/bulk_delete';





// College School
$route['college_school'] = 'CollegeSchool/index';
$route['college_school/insert'] = 'CollegeSchool/insert';
$route['college_school/find/(:any)'] = 'CollegeSchool/find/$1';
$route['college_school/update/(:any)'] = 'CollegeSchool/update/$1';
$route['college_school/delete/(:any)'] = 'CollegeSchool/delete/$1';
$route['college_school/bulk_delete'] = 'CollegeSchool/bulk_delete';




// Barangay
$route['barangay'] = 'Barangay/index';



// Senior High School 
$route['senior_high_school'] = 'SeniorHighSchool/index';
$route['senior_high_school/insert'] = 'SeniorHighSchool/insert';
$route['senior_high_school/find/(:any)'] = 'SeniorHighSchool/find/$1';
$route['senior_high_school/update/(:any)'] = 'SeniorHighSchool/update/$1';
$route['senior_high_school/delete/(:any)'] = 'SeniorHighSchool/delete/$1';
$route['senior_high_school/bulk_delete'] = 'SeniorHighSchool/bulk_delete';



// Strand
$route['strand'] = 'Strand/index';
$route['strand/insert'] = 'Strand/insert';
$route['strand/find/(:any)'] = 'Strand/find/$1';
$route['strand/update/(:any)'] = 'Strand/update/$1';
$route['strand/delete/(:any)'] = 'Strand/delete/$1';
$route['strand/bulk_delete/'] = 'Strand/bulk_delete/';



// Course
$route['course'] = 'Course/index';
$route['course/insert'] = 'Course/insert';
$route['course/find/(:any)'] = 'Course/find/$1';
$route['course/update/(:any)'] = 'Course/update/$1';
$route['course/delete/(:any)'] = 'Course/delete/$1';
$route['course/bulk_delete/'] = 'Course/bulk_delete/';


// TVET Course
$route['tvet_course'] = 'TvetCourse/index';
$route['tvet_course/insert'] = 'TvetCourse/insert';
$route['tvet_course/find/(:any)'] = 'TvetCourse/find/$1';
$route['tvet_course/update/(:any)'] = 'TvetCourse/update/$1';
$route['tvet_course/delete/(:any)'] = 'TvetCourse/delete/$1';
$route['tvet_course/bulk_delete/'] = 'TvetCourse/bulk_delete/';


// Search
// $route['search'] = 'Search'; 
$route['search/find'] = 'Search/find';



// Test
$route['test/get_all'] = 'Test/get_all';
$route['test/insert'] = 'Test/insert';
$route['test/find/(:any)'] = 'Test/find/$1';
$route['test/update/(:any)'] = 'Test/update/$1';
$route['test/delete/(:any)'] = 'Test/delete/$1';
$route['test/bulk_delete/'] = 'Test/bulk_delete/';



// Scholar
$route['consolidate_senior_high'] = 'Scholar/consolidate_senior_high';
$route['consolidate_college'] = 'Scholar/consolidate_college';