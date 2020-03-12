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
    include_once '../objects/invoice_general_setting.php';

    $database = new Database();
    $db = $database->getConnection();

    $igs = new Invoice_general_setting($db);

    // get posted data
    $data = json_decode(file_get_contents("php://input"));

    $igs->user_id = $data->user_id;
    $igs->deduction1status = 1;
    $igs->currency = 'CAD';
    $igs->deduction1label = 'Discount';
    $igs->deduction1type = 'P';
    $igs->deduction1percentage = 0;
    $igs->deduction2status = 0;
    $igs->deduction2label = 'Promotion';
    $igs->deduction2type = 'P';
    $igs->deduction2percentage = 0;
    $igs->addition1status = 1;
    $igs->addition1label = 'TAX';
    $igs->addition1type = 'P';
    $igs->addition1percentage = 5;
    $igs->addition2status = 0;
    $igs->addition2label = 'PST';
    $igs->addition2type = 'P';
    $igs->addition2percentage = 7;
    $igs->addition3status = 0;
    $igs->addition3label = 'Service';
    $igs->addition3type = 'F';
    $igs->addition3percentage = 0;
    if($igs->create()){

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
