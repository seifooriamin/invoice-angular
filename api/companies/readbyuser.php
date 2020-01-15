<?php

    header("Access_Control_Allow_Origin: *");
    header("Content_Type: application/json; charset=UTF-8");

    include_once("../config/database.php");
    include_once("../objects/companies.php");

    $database=new Database();
    $db=$database->getConnection();

    $companies= new Companies($db);
    $data = json_decode(file_get_contents("php://input"));
    $companies->user_id = $data->user_id;

    $stmt=$companies->readByUser();

    $num = $stmt->rowCount();

    if($num>0){
        $companies_arr=array();
        $companies_arr["records"]=array();

        while ($row=$stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $companies_item=array(
                "id" => $id,
                "name" => $name,
                "address" => $address,
                "phone" => $phone,
                "business_no" => $business_no,
                "gst_no" => $gst_no,
                "website" => $website,
                "email" => $email,
                "logo_link" => $logo_link,
                "user_id" => $user_id,
                "first_name" => $first_name,
                "last_name" => $last_name,
                "created" => $created
            );
            array_push($companies_arr["records"],$companies_item);
        }
        http_response_code(200);
        echo json_encode($companies_arr);
    }else{
        http_response_code(404);
        echo json_encode(array("message" => "no record found"));
    }

