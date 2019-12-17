<?php

    header("Access_Control_Allow_Origin: *");
    header("Content_Type: application/json; charset=UTF-8");

    include_once("../config/database.php");
    include_once("../objects/invoice.php");

    $database=new Database();
    $db=$database->getConnection();

    $invoice= new Invoice($db);
    $stmt=$invoice->read();

    $num=$invoice->count();

    if($num>0){
        $invoice_arr=array();
        $invoice_arr["records"]=array();

        while ($row=$stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $invoice_item=array(
                "id" => $id,
                "incoice_number" => $invoice_number,
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
                "sub_total" => $sub_total,
                "addition1" => $addition1,
                "addition2" => $addition2,
                "addition3" => $addition3,
                "deduction1" => $deduction1,
                "deduction2" => $deduction2,
                "total" => $total,
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
        http_response_code(404);
        echo json_encode(array("message" => "no record found"));
    }

