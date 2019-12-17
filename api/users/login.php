<?php
    // required headers
    header("Access-Control-Allow-Origin: http://localhost/php_jwt_rest_api/");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    // database connection will be here
    // files needed to connect to database
    include_once '../config/database.php';
    include_once '../objects/users.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // instantiate user object
    $user = new Users($db);

    // check email existence here
    // get posted data
    $data = json_decode(file_get_contents("php://input"));

    // set product property values
    $user->email = $data->email;
    $email_exists = $user->emailExists();
    $email_validated = $user->emailValidated();
    // files for jwt will be here
    // generate json web token
    include_once '../config/core.php';
    include_once '../libs/php-jwt-master/src/BeforeValidException.php';
    include_once '../libs/php-jwt-master/src/ExpiredException.php';
    include_once '../libs/php-jwt-master/src/SignatureInvalidException.php';
    include_once '../libs/php-jwt-master/src/JWT.php';
    use \Firebase\JWT\JWT;

    // generate jwt will be here
    // check if email exists and if password is correct
    if($email_exists && $email_validated && password_verify($data->password, $user->password )){

        $token = array(
           "iss" => $iss,
           "aud" => $aud,
           "iat" => $iat,
           "nbf" => $nbf,
           "data" => array(
               "id" => $user->id,
               "first_name" => $user->first_name,
               "last_name" => $user->last_name,
               "email" => $user->email,
               "access_code" => $user->access_code,
               "access_level" => $user->access_level
           )
        );

        // set response code
        http_response_code(200);

        // generate jwt
        $jwt = JWT::encode($token, $key);
        echo json_encode(
                array(
                    "message" => "Successful login.",
                    "jwt" => $jwt,
                    "access_level" => $user->access_level
                )
            );

    }

    // login failed will be here
    // login failed
    else{

        // set response code
        http_response_code(401);

        // tell the user login failed
        echo json_encode(array("message" => "Login failed."));
    }
?>
