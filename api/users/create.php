<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");

    // database connection will be here
    // files needed to connect to database
    include_once '../config/database.php';
    include_once '../objects/users.php';
    include_once '../libs/php/utils.php';
    include_once '../config/core.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // instantiate product object
    $user = new Users($db);
    $utility = new Utils();

    // submitted data will be here
    // get posted data
    $data = json_decode(file_get_contents("php://input"));
    $user->email = $data->email;
    if(!empty($data->email)){
        if(!($user->emailExists())){
            if(
                !empty($data->first_name) &&
                !empty($data->last_name) &&
                !empty($data->email) &&
                !empty($data->password)
            )
            {
                $user->first_name = $data->first_name;
                $user->last_name = $data->last_name;
                $user->email = $data->email;
                $user->password = $data->password;
                $user->address1 = $data->address1;
                $user->address2 = $data->address2;
                $user->city = $data->city;
                $user->province = $data->province;
                $user->country = $data->country;
                $user->postal_code = $data->postal_code;
                $user->contact_number = $data->contact_number;
                $user->access_level = "1";
                $user->access_code = $utility->getToken();
                $user->status = "0";
                if($user->create()) {

                    $send_to_email = $user->email;
                    $body = "Hi {$user->first_name} {$user->last_name}.<br /><br />";
//                    $body .= "Please click the following link to verify your email and login: {$home_url}verify?access_code={$user->access_code}";
                    $body .= "Please click the following link to verify your email and login: http://localhost:4200/verify?access_code={$user->access_code}";
                    $subject = "Verification Email";
                    if ($utility->sendEmailViaPhpMail($send_to_email, $subject, $body)) {
                        $email_has_sent=true;
                    } else {
                        $email_has_sent=false;
                    }
                    if($email_has_sent){
                        http_response_code(200);
                        echo json_encode(array("message" => "UWCES"));
                    }else{
                        http_response_code(200);
                        echo json_encode(array("message" => "UWCENS"));
                    }

                }
                // message if unable to create user
                else{

                    // set response code
                    http_response_code(400);

                    // display message: unable to create user
                    echo json_encode(array("message" => "Unable to create user."));
                }
            }
            else{

                // set response code - 400 bad request
                http_response_code(400);

                // tell the user
                echo json_encode(array("message" => "Fill all the mandatory fields."));
            }
        }else{
                echo json_encode(array("message" => "Duplicated email"));
             }
    }


?>
