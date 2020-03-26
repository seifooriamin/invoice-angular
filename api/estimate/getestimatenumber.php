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
    $data = json_decode(file_get_contents("php://input"));
    $estimate->user_id = $data->user_id;

    $estimate->getEstimateNumber();

    if($estimate->id!=null){
        // create array
        $estimate_arr = array(
            "estimate_number" => $estimate->estimate_number,
            "id" => $estimate->id
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($estimate_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user product does not exist
        echo json_encode(array("message" => "FAIL"));
    }
?>
