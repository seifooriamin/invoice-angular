<?php

    header("Access_Control_Allow_Origin: *");
    header("Content_Type: application/json; charset=UTF-8");

    include_once("../config/database.php");
    include_once("../objects/invoice_general_setting.php");

    $database=new Database();
    $db=$database->getConnection();

    $igs= new InvoiceGeneralSetting($db);
    $data = json_decode(file_get_contents("php://input"));
    $igs->user_id = $data->user_id;
    $stmt=$igs->readOneByUserID();

    if($igs->id != null){
            $igs_arr = array(
                "id" => $igs->id,
                "user_id" => $igs->user_id,
                "deduction1status" => $igs->deduction1status,
                "deduction1label" => $igs->deduction1label,
                "deduction1type" => $igs->deduction1type,
                "deduction1percentage" => $igs->deduction1percentage,
                "deduction2status" => $igs->deduction2status,
                "deduction2label" => $igs->deduction2label,
                "deduction2type" => $igs->deduction2type,
                "deduction2percentage" => $igs->deduction2percentage,
                "addition1status" => $igs->addition1status,
                "addition1label" => $igs->addition1label,
                "addition1type" => $igs->addition1type,
                "addition1percentage" => $igs->addition1percentage,
                "addition2status" => $igs->addition2status,
                "addition2label" => $igs->addition2label,
                "addition2type" => $igs->addition2type,
                "addition2percentage" => $igs->addition2percentage,
                "addition3status" => $igs->addition3status,
                "addition3label" => $igs->addition3label,
                "addition3type" => $igs->addition3type,
                "addition3percentage" => $igs->addition3percentage,
                "created" => $igs->created
            );
            http_response_code(200);
            echo json_encode($igs_arr);
        }
    else{
        http_response_code(404);
        echo json_encode(array("message" => "FAIL"));
    }


