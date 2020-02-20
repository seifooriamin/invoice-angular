<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/invoice.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $invoice = new Invoice($db);

    // get id of product to be edited
    $data = json_decode(file_get_contents("php://input"));

    // set ID property of product to be edited
    $invoice->id = $data->id;

    // set product property values
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

    // update the product
    if($invoice->update()){

        // set response code - 200 ok
        http_response_code(200);

        // tell the user
        echo json_encode(array("message" => "SUCCESS"));
    }

    // if unable to update the product, tell the user
    else{

        // set response code - 503 service unavailable
        http_response_code(503);

        // tell the user
        echo json_encode(array("message" => "FAIL"));
    }
?>
