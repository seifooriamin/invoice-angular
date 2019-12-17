<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");


    // get database connection
    include_once '../config/database.php';

    // instantiate product object
    include_once '../objects/companies.php';

    $database = new Database();
    $db = $database->getConnection();

    $companies = new Companies($db);

    // get posted data
    $data = json_decode(file_get_contents("php://input"));

    // make sure data is not empty
    if(
        !empty($data->name) &&
        !empty($data->address) &&
        !empty($data->user_id)
    ){

        // set product property values
        $companies->name = $data->name;
        $companies->address = $data->address;
        $companies->phone = $data->phone;
        $companies->business_no = $data->business_no;
        $companies->gst_no = $data->gst_no;
        $companies->website = $data->website;
        $companies->email = $data->email;
        $companies->logo_link = $data->logo_link;
        $companies->user_id = $data->user_id;


        // create the product
        if($companies->create()){

            // set response code - 201 created
            http_response_code(201);

            // tell the user
            echo json_encode(array("message" => "New Company Has Been Registered."));
        }

        // if unable to create the product, tell the user
        else{

            // set response code - 503 service unavailable
            http_response_code(503);

            // tell the user
            echo json_encode(array("message" => "Unable to Register New Company."));
        }
    }

    // tell the user data is incomplete
    else{

        // set response code - 400 bad request
        http_response_code(400);

        // tell the user
        echo json_encode(array("message" => "Fill all the mandatory fields."));
    }
?>
