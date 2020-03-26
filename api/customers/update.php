<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: PATCH, POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/customers.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $customers = new Customers($db);

    // get id of product to be edited
    $data = json_decode(file_get_contents("php://input"));

    // set ID property of product to be edited
    $customers->id = $data->id;

    // set product property values
    $customers->name = $data->name;
    $customers->address = $data->address;
    $customers->phone = $data->phone;
    $customers->email = $data->email;
    $customers->user_id = $data->user_id;

    // update the product
    if($customers->update()){

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
