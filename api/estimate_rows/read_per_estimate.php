<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Headers: access");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Allow-Credentials: true");
    header('Content-Type: application/json');

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/estimate_rows.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $estimate_rows = new Estimate_rows($db);

    // set ID property of record to read
    $estimate_rows->estimate_id = isset($_GET['estimate_id']) ? $_GET['estimate_id'] : die();

    // read the details of product to be edited
    $stmt=$estimate_rows->readPerEstimate();

    $num=$estimate_rows->countPerEstimate();

    if($num>0){
        $estimate_rows_arr=array();
        $estimate_rows_arr["records"]=array();

        while ($row=$stmt->fetch(PDO::FETCH_ASSOC)){
            extract($row);
            $estimate_rows_item=array(
                "inx" => $inx,
                "description" => $description,
                "comment" => $comment,
                "unit_price" => $unit_price,
                "unit_measure" => $unit_measure,
                "quantity" => $quantity,
                "total_row_price" => $quantity*$unit_price,
                "user_id" => $user_id
            );
            array_push($estimate_rows_arr["records"],$estimate_rows_item);
        }
        http_response_code(200);
        echo json_encode($estimate_rows_arr);
    }else{
        http_response_code(404);
        echo json_encode(array("message" => "no record found"));
    }

?>
