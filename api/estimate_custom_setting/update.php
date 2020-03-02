<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/estimate_custom_setting.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $ecs = new Estimate_custom_setting($db);

    // get id of product to be edited
    $data = json_decode(file_get_contents("php://input"));


    $ecs->estimate_id = $data->estimate_id;
    $ecs->currency = $data->currency;
    $ecs->deduction1status = $data->deduction1status ? 1 : 0;
    $ecs->deduction1label = $data->deduction1label;
    $ecs->deduction1type = $data->deduction1type;
    $ecs->deduction1percentage = $data->deduction1percentage;
    $ecs->deduction2status = $data->deduction2status ? 1 : 0;
    $ecs->deduction2label = $data->deduction2label;
    $ecs->deduction2type = $data->deduction2type;
    $ecs->deduction2percentage = $data->deduction2percentage;
    $ecs->addition1status = $data->addition1status ? 1 : 0;
    $ecs->addition1label = $data->addition1label;
    $ecs->addition1type = $data->addition1type;
    $ecs->addition1percentage = $data->addition1percentage;
    $ecs->addition2status = $data->addition2status ? 1 : 0;
    $ecs->addition2label = $data->addition2label;
    $ecs->addition2type = $data->addition2type;
    $ecs->addition2percentage = $data->addition2percentage;
    $ecs->addition3status = $data->addition3status ? 1 : 0;
    $ecs->addition3label = $data->addition3label;
    $ecs->addition3type = $data->addition3type;
    $ecs->addition3percentage = $data->addition3percentage;


    // update the product
    if($ecs->update()){

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
