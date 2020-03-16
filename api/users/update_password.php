<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json');

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/users.php';
    include_once '../libs/php/utils.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $users = new Users($db);
    $utility = new Utils();

    $data = json_decode(file_get_contents("php://input"));
    $users->password = $data->password;
    $users->access_code = $data->access_code;
    $users->new_access_code = $utility->getToken();

    if($users->updatePassword()){
        http_response_code(200);
        echo json_encode(array("message" => "SUCCESS"));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "FAIL"));
    }

?>
