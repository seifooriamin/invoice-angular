<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET, POST");
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
    $users->email = $data->email;
    $users->access_code = $utility->getToken();

    if($users->updateAccessCode()){
        http_response_code(200);
        echo json_encode(array("message" => $users->access_code));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "FAIL"));
    }

?>
