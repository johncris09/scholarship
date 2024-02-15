<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Export extends RestController
{

  function __construct()
  {
    // Construct the parent class
    parent::__construct();
  }
  public function index_get()
  {
    // Load the DB utility class
    $this->load->dbutil();

    // get all the table
    $tables = $this->db->list_tables();

    // data preferences
    $prefs = array(
      'tables'             => $tables,   // Array of tables to backup.
      'ignore'             => array(),   // List of tables to omit from the backup
      'format'             => 'sql',     // gzip, zip, txt
      'add_drop'           => true,      // Whether to add DROP TABLE statements to backup file
      'add_insert'         => true,      // Whether to add INSERT data to backup file
      'newline'            => "\n",      // Newline character used in backup file
      'foreign_key_checks' => false,
    );

    // Backup your entire database and assign it to a variable
    $backup = $this->dbutil->backup($prefs);
    $filename = date("Y-m-d h.i.s") . ' ' . $this->db->database . '.sql';

    if (write_file(FCPATH . '/database/' . $filename, $backup)) {

      $data = array(
        'response' => true,
        'message' => 'Database Exported.'
      );
    } else {
      $data = array(
        'response' => false,
        'message' => $this->db->error()['message']
      );
    }

    echo json_encode($data);

  }
}