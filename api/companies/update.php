<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: PATCH, POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/companies.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $companies = new Companies($db);

    // get id of product to be edited
//    $data = json_encode(file_get_contents("php://input"));
    $image=!empty($_FILES["file"]["name"])
        ? sha1_file($_FILES['file']['tmp_name']) . "-" . basename($_FILES["file"]["name"]) : "";
    $data=json_decode($_POST["data"]);
    if($image !== ''){
        $companies->logo_link = $image;
        if(!$companies->imageValidator()){
            $image = "";
            $imageMessage = "INV";
        } else {
            $imageMessage = "IV";
        }

    } else {
        $imageMessage = "Empty";
    }

    if(
        !empty($data->name) &&
        !empty($data->address) &&
        !empty($data->user_id) &&
        !empty(($data->id))
        ) {
        // set ID property of product to be edited
        $companies->id = $data->id;

        // set product property values
        $companies->name = $data->name;
        $companies->address = $data->address;
        $companies->phone = $data->phone;
        $companies->business_no = $data->business_no;
        $companies->gst_no = $data->gst_no;
        $companies->website = $data->website;
        $companies->email = $data->email;
        $companies->logo_link = $image;
        $companies->user_id = $data->user_id;

        // update the product
        if ($companies->update()) {

            if($imageMessage == 'IV') {
                if($companies->uploadPhoto()){

                    $message = 'SIU';
                } else {

                    $message = 'SINU';
                }
            } else {
                if($imageMessage == 'Empty'){
                    $message = 'SIE';
                }else{
                    $message = 'SINV';
                }
            }

            // set response code - 200 ok
            http_response_code(200);

            // tell the user
            echo json_encode(array("message" => $message));
        } // if unable to update the product, tell the user
        else {

            // set response code - 503 service unavailable
            http_response_code(503);

            // tell the user
            echo json_encode(array("message" => "FAIL"));
        }
    } else {
        // set response code - 400 bad request
        http_response_code(400);

        // tell the user
        echo json_encode(array("message" => "INCOMPLETE"));
    }
?>
