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
    $users = new Users($db);

    $data = json_decode(file_get_contents("php://input"));
    $users->email = $data->email;

    $users->getLastUserID();

    if($users->id!=null){
        $users_arr = array(
            "id" => $users->id,
            "access_code" => $users->access_code,
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($users_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user product does not exist
        echo json_encode(array("message" => "FAIL"));
    }
?>
