<?php
    // required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/customers.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $customers = new Customers($db);

    // set ID property of record to read
    $customers->id = isset($_GET['id']) ? $_GET['id'] : die();
    $customers->user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

    // read the details of product to be edited
    $customers->readOne();

    if($customers->name!=null){
        // create array
        $customers_arr = array(
            "id" =>  $customers->id,
            "name" => $customers->name,
            "address" => $customers->address,
            "phone" => $customers->phone,
            "email" => $customers->email,
            "user_id" => $customers->user_id,
            "user_full_name" => $customers->user_first_name." ". $customers->user_last_name,
            "created" => $customers->created
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($customers_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(200);

        // tell the user product does not exist
        echo json_encode(array("message" => "NOT_FOUND"));
    }
?>
