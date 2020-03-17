<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Max-Age: 3600");
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'vendor/autoload.php';

include_once '../../config/core.php';

$mail = new PHPMailer(true);
$data = json_decode(file_get_contents("php://input"));
$to = $data->email;
$subject = $data->subject;
$user = $data->name;
$module = $data->module;


try{

    $mail->setFrom('submit@einvoicemaker.com', 'Easy Invoice Maker');
    $mail->addAddress($to);
    $mail->Subject = $subject;
    $mail->isHTML(true);
//    $mail->addEmbeddedImage('email_template/images/logo.png', 'logo_p2t');
    $mail->addEmbeddedImage('email_template/images/logo-text.png', 'logo_p2t');
//    $mail->addEmbeddedImage('email_template/images/instagram.png', 'instagram');
//    $mail->addEmbeddedImage('email_template/images/facebook.png', 'facebook');
//    $mail->addEmbeddedImage('email_template/images/twitter.png', 'twitter');
    switch ($module) {
        case 'CP':
            $message = file_get_contents('email_template/change_password.html');
            $message = str_replace('%user%', $user, $message);
            break;
        case 'RP':
            $token = $data->token;
            $message = file_get_contents('email_template/reset_password.html');
            $message = str_replace('%token%', $token, $message);
            $message = str_replace('%user%', $user, $message);
            break;
        case 'AE':
            $token = $data->token;
            $message = file_get_contents('email_template/activation_email.html');
            $message = str_replace('%token%', $token, $message);
            $message = str_replace('%user%', $user, $message);
            break;
    }

    $mail->msgHTML($message);
//    $mail->AltBody=strip_tags($message);
    /* SMTP parameters. */
    $mail->SMTPDebug = 0;
    $mail->isSMTP();
    $mail->Host = 'linux5.centraldnserver.com';
    $mail->SMTPAuth = TRUE;
    $mail->SMTPSecure = 'ssl';
    $mail->Username = 'submit@einvoicemaker.com';
    $mail->Password = 'Peg@h9592';
    $mail->Port = 465;


    /* Finally send the mail. */
    $mail->send();
    http_response_code(200);
    echo json_encode(array("message" => "SENT"));
}
catch (Exception $e)
{
    http_response_code(400);
    echo json_encode(array("message" => "FAIL"));
}

