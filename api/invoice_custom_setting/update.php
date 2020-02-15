<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/invoice_custom_setting.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $ics = new Invoice_custom_setting($db);

    // get id of product to be edited
    $data = json_decode(file_get_contents("php://input"));


    $ics->invoice_id = $data->invoice_id;
    $ics->currency = $data->currency;
    $ics->deduction1status = $data->deduction1status;
    $ics->deduction1label = $data->deduction1label;
    $ics->deduction1type = $data->deduction1type;
    $ics->deduction1percentage = $data->deduction1percentage;
    $ics->deduction2status = $data->deduction2status;
    $ics->deduction2label = $data->deduction2label;
    $ics->deduction2type = $data->deduction2type;
    $ics->deduction2percentage = $data->deduction2percentage;
    $ics->addition1status = $data->addition1status;
    $ics->addition1label = $data->addition1label;
    $ics->addition1type = $data->addition1type;
    $ics->addition1percentage = $data->addition1percentage;
    $ics->addition2status = $data->addition2status;
    $ics->addition2label = $data->addition2label;
    $ics->addition2type = $data->addition2type;
    $ics->addition2percentage = $data->addition2percentage;
    $ics->addition3status = $data->addition3status;
    $ics->addition3label = $data->addition3label;
    $ics->addition3type = $data->addition3type;
    $ics->addition3percentage = $data->addition3percentage;


    // update the product
    if($ics->update()){

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
