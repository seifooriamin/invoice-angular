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
    include_once '../objects/estimate_custom_setting.php';

    $database = new Database();
    $db = $database->getConnection();

    $ecs = new Estimate_custom_setting($db);

    // get posted data
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

    if($ecs->create()){

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
