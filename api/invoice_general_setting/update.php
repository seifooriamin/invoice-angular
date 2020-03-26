<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST, PATCH");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/invoice_general_setting.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $igs = new Invoice_general_setting($db);

    // get id of product to be edited
    $data = json_decode(file_get_contents("php://input"));

    $igs->currency = $data->currency;
    $igs->deduction1status = $data->deduction1status ? 1 : 0;
    $igs->deduction1label = $data->deduction1label;
    $igs->deduction1type = $data->deduction1type;
    $igs->deduction1percentage = $data->deduction1percentage;
    $igs->deduction2status = $data->deduction2status ? 1 : 0;
    $igs->deduction2label = $data->deduction2label;
    $igs->deduction2type = $data->deduction2type;
    $igs->deduction2percentage = $data->deduction2percentage;
    $igs->addition1status = $data->addition1status ? 1 : 0;
    $igs->addition1label = $data->addition1label;
    $igs->addition1type = $data->addition1type;
    $igs->addition1percentage = $data->addition1percentage;
    $igs->addition2status = $data->addition2status ? 1 : 0;
    $igs->addition2label = $data->addition2label;
    $igs->addition2type = $data->addition2type;
    $igs->addition2percentage = $data->addition2percentage;
    $igs->addition3status = $data->addition3status ? 1 : 0;
    $igs->addition3label = $data->addition3label;
    $igs->addition3type = $data->addition3type;
    $igs->addition3percentage = $data->addition3percentage;
    $igs->id = $data->id;

    // update the product
    if($igs->update()){

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
