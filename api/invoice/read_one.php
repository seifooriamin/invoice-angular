<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json');

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/invoice.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $invoice = new Invoice($db);

    // set ID property of record to read
    $invoice->id = isset($_GET['id']) ? $_GET['id'] : die();

    // read the details of product to be edited
    $invoice->readOne();

    if($invoice->invoice_number!=null){
        // create array
        $invoice_arr = array(
            "invoice_number" => $invoice->invoice_number,
            "date" => $invoice->date,
            "customer_id" => $invoice->customer_id,
            "customer_name" => $invoice->customer_name,
            "customer_address" => $invoice->customer_address,
            "company_id" => $invoice->company_id,
            "company_name" => $invoice->company_name,
            "company_address" => $invoice->company_address,
            "company_email" => $invoice->company_email,
            "company_phone" => $invoice->company_phone,
            "company_business_no" => $invoice->company_business_no,
            "company_gst_no" => $invoice->company_gst_no,
            "company_website" => $invoice->company_website,
            "company_logo_link" => $invoice->company_logo_link,
            "sub_total" => $invoice->sub_total,
            "addition1" => $invoice->addition1,
            "addition2" => $invoice->addition2,
            "addition3" => $invoice->addition3,
            "deduction1" => $invoice->deduction1,
            "deduction2" => $invoice->deduction2,
            "total" => $invoice->total,
            "note" => $invoice->note,
            "created" => $invoice->created,
            "user_id" => $invoice->user_id,
            "user_full_name" => $invoice->user_first_name." ".$invoice->user_last_name,
            "year" => $invoice->year
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
        echo json_encode(array("message" => "invoice does not exist."));
    }
?>
