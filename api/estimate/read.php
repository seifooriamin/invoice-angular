<?php

    header("Access_Control_Allow_Origin: *");
    header("Content_Type: application/json; charset=UTF-8");

    include_once("../config/database.php");
    include_once("../objects/estimate.php");

    $database=new Database();
    $db=$database->getConnection();

    $estimate= new Estimate($db);
    $stmt=$estimate->read();

    $num=$estimate->count();

    if($num>0){
        $estimate_arr=array();
        $estimate_arr["records"]=array();

        while ($row=$stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $estimate_item=array(
                "id" => $id,
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
                "total_price" => $total_price,
                "gst" => $gst,
                "created" => $created,
                "user_id" => $user_id,
                "user_full_name" => $user_first_name." ".$user_last_name,
            );
            array_push($estimate_arr["records"],$estimate_item);
        }
        http_response_code(200);
        echo json_encode($estimate_arr);
    }else{
        http_response_code(404);
        echo json_encode(array("message" => "no record found"));
    }

