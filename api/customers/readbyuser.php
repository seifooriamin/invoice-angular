<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


    include_once("../config/database.php");
    include_once("../objects/customers.php");

    $database=new Database();
    $db=$database->getConnection();

    $customers= new Customers($db);
    $data = json_decode(file_get_contents("php://input"));
    $customers->user_id = $data->user_id;
    $stmt=$customers->readByUser();

    $num=$stmt->rowCount();

    if($num>0){
        $customers_arr=array();
        $customers_arr["records"]=array();

        while ($row=$stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $customers_item=array(
                "id" => $id,
                "name" => $name,
                "address" => $address,
                "phone" => $phone,
                "email" => $email,
                "user_id" => $user_id,
                "full_name" => $first_name." ".$last_name,
                "created" => $created
            );
            array_push($customers_arr["records"],$customers_item);
        }
        http_response_code(200);
        echo json_encode($customers_arr);
    }else{
        http_response_code(200);
        echo json_encode(array("message" => "NOT_FOUND"));
    }

