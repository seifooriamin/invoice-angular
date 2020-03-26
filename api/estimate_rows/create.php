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
    include_once '../objects/estimate_rows.php';

    $database = new Database();
    $db = $database->getConnection();

    $estimate_rows = new Estimate_rows($db);

    // get posted data
    $data = json_decode(file_get_contents("php://input"));


    // make sure data is not empty
    if(
        !empty($data->estimate_id) &&
        !empty($data->description) &&
        !empty($data->unit_price) &&
        !empty($data->quantity) &&
        !empty($data->user_id)
    ){

        $estimate_rows->inx = $data->inx ? $data->inx : 0;
        $estimate_rows->estimate_id = $data->estimate_id;
        $estimate_rows->description = $data->description;
        $estimate_rows->comment = $data->comment;
        $estimate_rows->unit_measure = $data->unit_measure;
        $estimate_rows->unit_price = $data->unit_price;
        $estimate_rows->quantity = $data->quantity;
        $estimate_rows->user_id = $data->user_id;

        if($estimate_rows->create()){

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
