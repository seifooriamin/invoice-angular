<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");

    include_once '../libs/php/utils.php';
    require "../libs/php/vendor/autoload.php";
    $utility = new Utils();

    $data = json_decode(file_get_contents("php://input"));
    $to = $data->email;
    $subject = 'Test';
    $body = "Amin";
    if($utility->sendEmail($to, $subject, $body)) {
        http_response_code(200);
        echo json_encode(array("message" => "SENT"));
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "FAIL"));
    }


?>
