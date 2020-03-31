<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/companies.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $companies = new Companies($db);

    // set ID property of record to read
    $companies->id = isset($_GET['id']) ? $_GET['id'] : die();
    $companies->user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();
    // read the details of product to be edited
    $companies->readOne();

    if($companies->name!=null){
        // create array
        $companies_arr = array(
            "id" =>  $companies->id,
            "name" => $companies->name,
            "address" => $companies->address,
            "phone" => $companies->phone,
            "business_no" => $companies->business_no,
            "gst_no" => $companies->gst_no,
            "website" => $companies->website,
            "email" => $companies->email,
            "logo_link" => $companies->logo_link,
            "user_id" => $companies->user_id,
            "user_full_name" => $companies->user_first_name." ". $companies->user_last_name,
            "created" => $companies->created,
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($companies_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(200);

        // tell the user product does not exist
        echo json_encode(array("message" => "NOT_FOUND"));
    }
?>
