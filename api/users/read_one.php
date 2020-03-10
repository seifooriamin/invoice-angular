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
    $users->readByID();

    if($users->first_name!=null){
        // create array
        $users_arr = array(
            "first_name" => $users->first_name,
            "last_name" => $users->last_name,
            "email" => $users->email,
            "address1" => $users->address1,
            "address2" => $users->address2,
            "city" => $users->city,
            "province" => $users->province,
            "country" => $users->country,
            "postal_code" => $users->postal_code,
            "contact_number" => $users->contact_number,
            "id" => $users->id
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
