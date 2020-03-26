<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: POST, GET');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");
    // core configuration
    include_once "../config/core.php";

    // include classes
    include_once '../config/database.php';
    include_once '../objects/users.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // initialize objects
    $user = new Users($db);
    $data = json_decode(file_get_contents("php://input"));
    // set access code
    $user->access_code=$data->access_code;

    if(!$user->accessCodeExists()){
        http_response_code(400);
        echo json_encode(array("message" => "ACNF"));
    }
    else{
        $user->status=1;
        if($user->updateStatusByAccessCode()){
            http_response_code(200);
            echo json_encode(array("message" => "AA"));

        } else {
            http_response_code(400);
            echo json_encode(array("message" => "AF"));
        }
    }
?>
