<?php

    header("Access_Control_Allow_Origin: *");
    header("Content_Type: application/json; charset=UTF-8");

    include_once("../config/database.php");
    include_once("../objects/estimate_rows.php");

    $database=new Database();
    $db=$database->getConnection();

    $estimate_rows= new Estimate_rows($db);
    $stmt=$estimate_rows->read();

    $num=$estimate_rows->count();

    if($num>0){
        $estimate_rows_arr=array();
        $estimate_rows_arr["records"]=array();

        while ($row=$stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $estimate_rows_item=array(
                "estimate_id" => $estimate_id,
                "inx" => $inx,
                "description" => $description,
                "comment" => $comment,
                "unit_price" => $unit_price,
                "unit_measure" => $unit_measure,
                "quantity" => $quantity,
                "total_row_price" => $quantity*$unit_price,
                "user_id" => $user_id
            );
            array_push($estimate_rows_arr["records"],$estimate_rows_item);
        }
        http_response_code(200);
        echo json_encode($estimate_rows_arr);
    }else{
        http_response_code(404);
        echo json_encode(array("message" => "no record found"));
    }

