<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object file
    include_once '../config/database.php';
    include_once '../objects/estimate_custom_setting.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $ecs = new Estimate_custom_setting($db);

    // get product id
    $data = json_decode(file_get_contents("php://input"));

    // set product id to be deleted
    $ecs->estimate_id = $data->estimate_id;

    // delete the product
    if($ecs->delete()){

        // set response code - 200 ok
        http_response_code(200);

        // tell the user
        echo json_encode(array("message" => "SUCCESS"));
    }

    // if unable to delete the product
    else{

        // set response code - 503 service unavailable
        http_response_code(503);

        // tell the user
        echo json_encode(array("message" => "FAIL"));
    }
?>
