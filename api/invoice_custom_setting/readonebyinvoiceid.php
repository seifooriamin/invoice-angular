<?php

    header("Access_Control_Allow_Origin: *");
    header("Content_Type: application/json; charset=UTF-8");

    include_once("../config/database.php");
    include_once("../objects/invoice_custom_setting.php");

    $database=new Database();
    $db=$database->getConnection();

    $ics= new Invoice_custom_setting($db);
    $ics->invoice_id = isset($_GET['invoice_id']) ? $_GET['invoice_id'] : die();
    $stmt=$ics->readOneByInvoiceID();

    if($ics->id != null){
            $ics_arr = array(
                "id" => $ics->id,
                "invoice_id" => $ics->invoice_id,
                "currency" => $ics->currency,
                "deduction1status" => $ics->deduction1status,
                "deduction1label" => $ics->deduction1label,
                "deduction1type" => $ics->deduction1type,
                "deduction1percentage" => $ics->deduction1percentage,
                "deduction2status" => $ics->deduction2status,
                "deduction2label" => $ics->deduction2label,
                "deduction2type" => $ics->deduction2type,
                "deduction2percentage" => $ics->deduction2percentage,
                "addition1status" => $ics->addition1status,
                "addition1label" => $ics->addition1label,
                "addition1type" => $ics->addition1type,
                "addition1percentage" => $ics->addition1percentage,
                "addition2status" => $ics->addition2status,
                "addition2label" => $ics->addition2label,
                "addition2type" => $ics->addition2type,
                "addition2percentage" => $ics->addition2percentage,
                "addition3status" => $ics->addition3status,
                "addition3label" => $ics->addition3label,
                "addition3type" => $ics->addition3type,
                "addition3percentage" => $ics->addition3percentage,
                "created" => $ics->created
            );
            http_response_code(200);
            echo json_encode($ics_arr);
        }
    else{
        http_response_code(404);
        echo json_encode(array("message" => "FAIL"));
    }


