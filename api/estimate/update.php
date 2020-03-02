<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/estimate.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $estimate = new Estimate($db);

    // get id of product to be edited
    $data = json_decode(file_get_contents("php://input"));

    // set ID property of product to be edited
    $estimate->id = $data->id;

    // set product property values
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

    // update the product
    if($estimate->update()){

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
