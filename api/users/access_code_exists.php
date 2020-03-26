<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: POST, GET');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/users.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $user = new Users($db);
    $data = json_decode(file_get_contents("php://input"));
    $user->access_code = $data->access_code;

    if($user->accessCodeExists()){

        http_response_code(200);
//        echo json_encode(array("message" => "SUCCESS"));
        echo json_encode(array("message" => "SUCCESS",
            "first_name" => $user->first_name,
            "last_name" => $user->last_name,
            "email" => $user->email));
    }

    else{
        http_response_code(404);
        echo json_encode(array("message" => "FAIL"));
    }
?>
