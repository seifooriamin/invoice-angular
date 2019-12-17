<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/estimate_rows.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $estimate_row = new Estimate_rows($db);

    // get id of product to be edited
    $data = json_decode(file_get_contents("php://input"));

    // set ID property of product to be edited
    $estimate_row->id = $data->id;

    // set product property values
    $estimate_row->inx = $data->inx;
    $estimate_row->description = $data->description;
    $estimate_row->comment = $data->comment;
    $estimate_row->unit_price = $data->unit_price;
    $estimate_row->unit_measure = $data->unit_measure;
    $estimate_row->quantity = $data->quantity;
    $estimate_row->user_id = $data->user_id;

    // update the product
    if($estimate_row->update()){

        // set response code - 200 ok
        http_response_code(200);

        // tell the user
        echo json_encode(array("message" => "Estimate row Information has been updated."));
    }

    // if unable to update the product, tell the user
    else{

        // set response code - 503 service unavailable
        http_response_code(503);

        // tell the user
        echo json_encode(array("message" => "Unable to update estimate row information."));
    }
?>
