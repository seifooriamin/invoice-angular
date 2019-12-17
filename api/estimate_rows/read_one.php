<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json');

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/estimate_rows.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $estimate_rows = new Estimate_rows($db);

    // set ID property of record to read
    $estimate_rows->id = isset($_GET['id']) ? $_GET['id'] : die();

    // read the details of product to be edited
    $estimate_rows->readOne();

    if($estimate_rows->estimate_id!=null){
        // create array
        $estimate_rows_arr = array(
            "id" => $estimate_rows->id,
            "invoice_id" => $estimate_rows->estimate_id,
            "inx" => $estimate_rows->inx,
            "description" => $estimate_rows->description,
            "comment" => $estimate_rows->comment,
            "unit_price" => $estimate_rows->unit_price,
            "unit_measure" => $estimate_rows->unit_measure,
            "quantity" => $estimate_rows->quantity,
            "created" => $estimate_rows->created,
            "user_id" => $estimate_rows->user_id,
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($estimate_rows_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user product does not exist
        echo json_encode(array("message" => "estimate row does not exist."));
    }
?>
