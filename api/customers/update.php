<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
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

    // get id of product to be edited
    $data = json_decode(file_get_contents("php://input"));

    // set ID property of product to be edited
    $companies->id = $data->id;

    // set product property values
    $companies->name = $data->name;
    $companies->address = $data->address;
    $companies->phone = $data->phone;
    $companies->business_no = $data->business_no;
    $companies->gst_no = $data->gst_no;
    $companies->website = $data->website;
    $companies->email = $data->email;
    $companies->logo_link = $data->logo_link;
    $companies->user_id = $data->user_id;

    // update the product
    if($companies->update()){

        // set response code - 200 ok
        http_response_code(200);

        // tell the user
        echo json_encode(array("message" => "Company Information has been updated."));
    }

    // if unable to update the product, tell the user
    else{

        // set response code - 503 service unavailable
        http_response_code(503);

        // tell the user
        echo json_encode(array("message" => "Unable to update company information."));
    }
?>
