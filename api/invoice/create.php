<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");


    // get database connection
    include_once '../config/database.php';

    // instantiate product object
    include_once '../objects/invoice.php';

    $database = new Database();
    $db = $database->getConnection();

    $invoice = new Invoice($db);

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

        $invoice->invoice_number = $data->invoice_number;
        $invoice->date = $data->date;
        $invoice->customer_id = $data->customer_id;
        $invoice->company_id = $data->company_id;
        $invoice->addition1 = $data->addition1;
        $invoice->addition2 = $data->addition2;
        $invoice->addition3 = $data->addition3;
        $invoice->deduction1 = $data->deduction1;
        $invoice->deduction2 = $data->deduction2;
        $invoice->note = $data->note;
        $invoice->user_id = $data->user_id;
        $invoice->year = $data->year;

        if($invoice->create()){

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
