<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/invoice.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $invoice = new Invoice($db);
    $data = json_decode(file_get_contents("php://input"));
    $invoice->user_id = $data->user_id;

    $invoice->getInvoiceNumber();

    if($invoice->id!=null){
        // create array
        $invoice_arr = array(
            "invoice_number" => $invoice->invoice_number,
            "id" => $invoice->id
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($invoice_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user product does not exist
        echo json_encode(array("message" => "FAIL"));
    }
?>
