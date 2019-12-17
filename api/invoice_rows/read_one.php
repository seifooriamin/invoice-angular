<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json');

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/invoice_rows.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $invoice_rows = new Invoice_rows($db);

    // set ID property of record to read
    $invoice_rows->id = isset($_GET['id']) ? $_GET['id'] : die();

    // read the details of product to be edited
    $invoice_rows->readOne();

    if($invoice_rows->invoice_id!=null){
        // create array
        $invoice_rows_arr = array(
            "id" => $invoice_rows->id,
            "invoice_id" => $invoice_rows->invoice_id,
            "inx" => $invoice_rows->inx,
            "description" => $invoice_rows->description,
            "comment" => $invoice_rows->comment,
            "unit_price" => $invoice_rows->unit_price,
            "unit_measure" => $invoice_rows->unit_measure,
            "quantity" => $invoice_rows->quantity,
            "created" => $invoice_rows->created,
            "user_id" => $invoice_rows->user_id,
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($invoice_rows_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user product does not exist
        echo json_encode(array("message" => "invoice row does not exist."));
    }
?>
