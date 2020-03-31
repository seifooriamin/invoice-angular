<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: POST, GET');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/invoice_rows.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $invoice_rows = new Invoice_rows($db);

    // set ID property of record to read
    $invoice_rows->invoice_id = isset($_GET['invoice_id']) ? $_GET['invoice_id'] : die();

    // read the details of product to be edited
    $stmt=$invoice_rows->readPerInvoice();

    $num=$stmt->rowCount();

    if($num>0){
        $invoice_rows_arr=array();
        $invoice_rows_arr["records"]=array();

        while ($row=$stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $invoice_rows_item=array(
                "inx" => $inx,
                "description" => $description,
                "comment" => $comment,
                "unit_price" => $unit_price,
                "unit_measure" => $unit_measure,
                "quantity" => $quantity,
                "total_row_price" => $quantity*$unit_price,
                "user_id" => $user_id,
                "invoice_id" => $invoice_id,
                "id" => $id
            );
            array_push($invoice_rows_arr["records"],$invoice_rows_item);
        }
        http_response_code(200);
        echo json_encode($invoice_rows_arr);
    }else{
        http_response_code(200);
        echo json_encode(array("message" => "NOT_FOUND"));
    }

?>
