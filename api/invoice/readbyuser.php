<?php

    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");

    include_once("../config/database.php");
    include_once("../objects/invoice.php");

    $database=new Database();
    $db=$database->getConnection();

    $invoice= new Invoice($db);
    $data = json_decode(file_get_contents("php://input"));
    $invoice->user_id = $data->user_id;
    $stmt=$invoice->readByUser();

    $num=$stmt->rowCount();

    if($num>0){
        $invoice_arr=array();
        $invoice_arr["records"]=array();

        while ($row=$stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $invoice_item=array(
                "id" => $id,
                "invoice_number" => $invoice_number,
                "date" => $date,
                "customer_id" => $customer_id,
                "customer_name" => $customer_name,
                "customer_address" => $customer_address,
                "company_id" => $company_id,
                "company_name" => $company_name,
                "company_address" => $company_address,
                "company_email" => $company_email,
                "company_phone" => $company_phone,
                "company_business_no" => $company_business_no,
                "company_gst_no" => $company_gst_no,
                "company_website" => $company_website,
                "company_logo_link" => $company_logo_link,
                "sub_total" => round($sub_total,2,PHP_ROUND_HALF_UP),
                "addition1" => round($addition1,2,PHP_ROUND_HALF_UP),
                "addition2" => round($addition2,2, PHP_ROUND_HALF_UP),
                "addition3" => round($addition3,2, PHP_ROUND_HALF_UP),
                "deduction1" => round($deduction1, 2, PHP_ROUND_HALF_UP),
                "deduction2" => round($deduction2,2,PHP_ROUND_HALF_UP),
                "total" => round($total,2, PHP_ROUND_HALF_UP),
                "note" => $note,
                "created" => $created,
                "user_id" => $user_id,
                "user_full_name" => $user_first_name." ".$user_last_name,
                "year" => $year
            );
            array_push($invoice_arr["records"],$invoice_item);
        }
        http_response_code(200);
        echo json_encode($invoice_arr);
    }else{
        http_response_code(200);
        echo json_encode(array("message" => "NOT_FOUND"));
    }

