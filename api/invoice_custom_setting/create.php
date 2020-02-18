<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");


    // get database connection
    include_once '../config/database.php';

    // instantiate product object
    include_once '../objects/invoice_custom_setting.php';

    $database = new Database();
    $db = $database->getConnection();

    $ics = new Invoice_custom_setting($db);

    // get posted data
    $data = json_decode(file_get_contents("php://input"));

    $ics->invoice_id = $data->invoice_id;
    $ics->currency = $data->currency;
    $ics->deduction1status = $data->deduction1status ? 1 : 0;
    $ics->deduction1label = $data->deduction1label;
    $ics->deduction1type = $data->deduction1type;
    $ics->deduction1percentage = $data->deduction1percentage;
    $ics->deduction2status = $data->deduction2status ? 1 : 0;
    $ics->deduction2label = $data->deduction2label;
    $ics->deduction2type = $data->deduction2type;
    $ics->deduction2percentage = $data->deduction2percentage;
    $ics->addition1status = $data->addition1status ? 1 : 0;
    $ics->addition1label = $data->addition1label;
    $ics->addition1type = $data->addition1type;
    $ics->addition1percentage = $data->addition1percentage;
    $ics->addition2status = $data->addition2status ? 1 : 0;
    $ics->addition2label = $data->addition2label;
    $ics->addition2type = $data->addition2type;
    $ics->addition2percentage = $data->addition2percentage;
    $ics->addition3status = $data->addition3status ? 1 : 0;
    $ics->addition3label = $data->addition3label;
    $ics->addition3type = $data->addition3type;
    $ics->addition3percentage = $data->addition3percentage;

    if($ics->create()){

        // set response code - 201 created
        http_response_code(201);

        // tell the user
        echo json_encode(array("message" => "SUCCESS"));
    }

    // if unable to create the product, tell the user
    else {

        // set response code - 503 service unavailable
        http_response_code(503);

        // tell the user
        echo json_encode(array("message" => "FAIL"));
    }

?>
