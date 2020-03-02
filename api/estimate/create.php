<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");


    // get database connection
    include_once '../config/database.php';

    // instantiate product object
    include_once '../objects/estimate.php';

    $database = new Database();
    $db = $database->getConnection();

    $estimate = new Estimate($db);

    // get posted data
    $data = json_decode(file_get_contents("php://input"));
//    $spacing=$invoice->invoice_number_generator()<10 ? "-0" : "-";
//    $current_invoice=date("Y"). $spacing . $invoice->invoice_number_generator();

    // make sure data is not empty
    if(
        !empty($data->date) &&
        !empty($data->customer_id) &&
        !empty($data->company_id) &&
        !empty($data->user_id)
    ){

        $estimate->estimate_number = $data->estimate_number;
        $estimate->date = $data->date;
        $estimate->customer_id = $data->customer_id;
        $estimate->company_id = $data->company_id;
        $estimate->addition1 = $data->addition1;
        $estimate->addition2 = $data->addition2;
        $estimate->addition3 = $data->addition3;
        $estimate->deduction1 = $data->deduction1;
        $estimate->deduction2 = $data->deduction2;
        $estimate->note = $data->note;
        $estimate->user_id = $data->user_id;


        if($estimate->create()){

            // set response code - 201 created
            http_response_code(201);

            // tell the user
            echo json_encode(array("message" => "SUCCESS"));
        }

        // if unable to create the product, tell the user
        else{

            // set response code - 503 service unavailable
            http_response_code(503);

            // tell the user
            echo json_encode(array("message" => "FAIL"));
        }
    }

    // tell the user data is incomplete
    else{

        // set response code - 400 bad request
        http_response_code(400);

        // tell the user
        echo json_encode(array("message" => "INCOMPLETE"));
    }
?>
