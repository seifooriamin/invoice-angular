<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, PATCH");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/users.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $users = new Users($db);

    // get id of product to be edited
    $data = json_decode(file_get_contents("php://input"));

    $users->id = $data->id;

    $users->first_name = $data->first_name;
    $users->last_name = $data->last_name;
    $users->address1 = $data->address1;
    $users->address2 = $data->address2;
    $users->city = $data->city;
    $users->province = $data->province;
    $users->postal_code = $data->postal_code;
    $users->contact_number = $data->contact_number;
    $users->country = $data->country;

    // update the product
    if($users->update()){

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
