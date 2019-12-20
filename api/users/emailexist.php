<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");

    // database connection will be here
    // files needed to connect to database
    include_once '../config/database.php';
    include_once '../objects/users.php';
    include_once '../config/core.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // instantiate product object
    $user = new Users($db);

    // submitted data will be here
    // get posted data
    $data = json_decode(file_get_contents("php://input"));
    $user->email = $data->email;
        if(($user->emailExists())){
            http_response_code(200);
            echo json_encode(array("message" => "email exist"));
        }else{
//            http_response_code(400);
//            echo json_encode(array("message" => "new email"));
            http_response_code(200);
            echo json_encode(array("message" => "new email"));
        }



?>
