<?php
    ini_set('display_errors',1);
    error_reporting(E_ALL);

//    $home_url="http://www.einvoicemaker.com/invoice/api/";
    $home_url="http://localhost/invoice-angular/api";
    $page=isset($_GET['page']) ? $_GET['page'] : 1;

    $records_per_page=5;

    $from_record_num=($records_per_page*$page)-$records_per_page;

    // set your default time-zone
    date_default_timezone_set('America/Vancouver');

    // variables used for jwt
    $key = "einvoicemaker_key";
    $iss = "http://einvoicemaker.com";
    $aud = "http://einvoicemaker.com";
    $iat = 1573104989;
    $nbf = 1573104989;
?>

