<?php

    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: POST, GET');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");

    include_once("../config/database.php");
    include_once("../objects/invoice_rows.php");

    $database=new Database();
    $db=$database->getConnection();

    $invoice_rows= new Invoice_rows($db);
    $stmt=$invoice_rows->read();

    $num=$invoice_rows->count();

    if($num>0){
        $invoice_rows_arr=array();
        $invoice_rows_arr["records"]=array();

        while ($row=$stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $invoice_rows_item=array(
                "invoice_id" => $invoice_id,
                "inx" => $inx,
                "description" => $description,
                "comment" => $comment,
                "unit_price" => $unit_price,
                "unit_measure" => $unit_measure,
                "quantity" => $quantity,
                "total_row_price" => $quantity*$unit_price,
                "user_id" => $user_id
            );
            array_push($invoice_rows_arr["records"],$invoice_rows_item);
        }
        http_response_code(200);
        echo json_encode($invoice_rows_arr);
    }else{
        http_response_code(404);
        echo json_encode(array("message" => "no record found"));
    }

