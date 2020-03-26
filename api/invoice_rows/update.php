<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, PATCH");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/invoice_rows.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $invoice_row = new Invoice_rows($db);

    // get id of product to be edited
    $data = json_decode(file_get_contents("php://input"));

    // set ID property of product to be edited
    $invoice_row->id = $data->id;

    // set product property values
    $invoice_row->inx = $data->inx;
    $invoice_row->description = $data->description;
    $invoice_row->comment = $data->comment;
    $invoice_row->unit_price = $data->unit_price;
    $invoice_row->unit_measure = $data->unit_measure;
    $invoice_row->quantity = $data->quantity;
    $invoice_row->user_id = $data->user_id;

    // update the product
    if($invoice_row->update()){

        // set response code - 200 ok
        http_response_code(200);

        // tell the user
        echo json_encode(array("message" => "Invoice row Information has been updated."));
    }

    // if unable to update the product, tell the user
    else{

        // set response code - 503 service unavailable
        http_response_code(503);

        // tell the user
        echo json_encode(array("message" => "Unable to update invoice row information."));
    }
?>
