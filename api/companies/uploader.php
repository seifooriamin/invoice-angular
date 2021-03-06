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
//    $data = json_decode(file_get_contents("php://input"));
//     $file = $_FILES["image"]["tmp_name"];
// make sure data is not empty
//            http_response_code(200);
//
//            // tell the user
//            echo json_encode(array("message" => $file));

    $image=!empty($_FILES["file"]["name"])
       ? sha1_file($_FILES['file']['tmp_name']) . "-" . basename($_FILES["file"]["name"]) : "";
    $companies->logo_link = $image;

    if($companies->uploadPhoto()){
            // set response code - 201 created
            http_response_code(200);

            // tell the user
            echo json_encode(array("message" => "IU"));
        }

        // if unable to create the product, tell the user
        else{

            // set response code - 503 service unavailable
            http_response_code(503);

            // tell the user
            echo json_encode(array("message" => "INU"));
        }
?>
