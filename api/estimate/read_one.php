<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json');
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/estimate.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $estimate = new Estimate($db);

    // set ID property of record to read
    $estimate->id = isset($_GET['id']) ? $_GET['id'] : die();
    $estimate->user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

    // read the details of product to be edited
    $estimate->readOne();

    if($estimate->estimate_number!=null){
        // create array
        $estimate_arr = array(
            "estimate_number" => $estimate->estimate_number,
            "date" => $estimate->date,
            "customer_id" => $estimate->customer_id,
            "customer_name" => $estimate->customer_name,
            "customer_address" => $estimate->customer_address,
            "company_id" => $estimate->company_id,
            "company_name" => $estimate->company_name,
            "company_address" => $estimate->company_address,
            "company_email" => $estimate->company_email,
            "company_phone" => $estimate->company_phone,
            "company_business_no" => $estimate->company_business_no,
            "company_gst_no" => $estimate->company_gst_no,
            "company_website" => $estimate->company_website,
            "company_logo_link" => $estimate->company_logo_link,
            "sub_total" => $estimate->sub_total,
            "addition1" => $estimate->addition1,
            "addition2" => $estimate->addition2,
            "addition3" => $estimate->addition3,
            "deduction1" => $estimate->deduction1,
            "deduction2" => $estimate->deduction2,
            "total" => $estimate->total,
            "note" => $estimate->note,
            "created" => $estimate->created,
            "user_id" => $estimate->user_id,
            "user_full_name" => $estimate->user_first_name." ".$estimate->user_last_name,
            "id" => $estimate->id
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($estimate_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(200);

        // tell the user product does not exist
        echo json_encode(array("message" => "NOT_FOUND"));
    }
?>
