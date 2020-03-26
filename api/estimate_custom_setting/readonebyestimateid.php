<?php

    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");

    include_once("../config/database.php");
    include_once("../objects/estimate_custom_setting.php");

    $database=new Database();
    $db=$database->getConnection();

    $ecs= new Estimate_custom_setting($db);
    $ecs->estimate_id = isset($_GET['estimate_id']) ? $_GET['estimate_id'] : die();
    $stmt=$ecs->readOneByEstimateID();

    if($ecs->id != null){
            $ecs_arr = array(
                "id" => $ecs->id,
                "estimate_id" => $ecs->estimate_id,
                "currency" => $ecs->currency,
                "deduction1status" => $ecs->deduction1status,
                "deduction1label" => $ecs->deduction1label,
                "deduction1type" => $ecs->deduction1type,
                "deduction1percentage" => $ecs->deduction1percentage,
                "deduction2status" => $ecs->deduction2status,
                "deduction2label" => $ecs->deduction2label,
                "deduction2type" => $ecs->deduction2type,
                "deduction2percentage" => $ecs->deduction2percentage,
                "addition1status" => $ecs->addition1status,
                "addition1label" => $ecs->addition1label,
                "addition1type" => $ecs->addition1type,
                "addition1percentage" => $ecs->addition1percentage,
                "addition2status" => $ecs->addition2status,
                "addition2label" => $ecs->addition2label,
                "addition2type" => $ecs->addition2type,
                "addition2percentage" => $ecs->addition2percentage,
                "addition3status" => $ecs->addition3status,
                "addition3label" => $ecs->addition3label,
                "addition3type" => $ecs->addition3type,
                "addition3percentage" => $ecs->addition3percentage,
                "created" => $ecs->created
            );
            http_response_code(200);
            echo json_encode($ecs_arr);
        }
    else{
        http_response_code(404);
        echo json_encode(array("message" => "FAIL"));
    }


