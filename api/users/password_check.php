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

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $users = new Users($db);

    $data = json_decode(file_get_contents("php://input"));
    $users->id = $data->id;

    // read the details of product to be edited
    $users->passwordCheck();
//
    if($users->password!=null && password_verify($data->old_password, $users->password)){
        http_response_code(200);
        echo json_encode(array("message" => 'PASSWORDOK'));
    }else{
//            http_response_code(400);
//            echo json_encode(array("message" => "new email"));
        http_response_code(200);
        echo json_encode(array("message" => 'PASSWORDFAIL'));
    }
?>
