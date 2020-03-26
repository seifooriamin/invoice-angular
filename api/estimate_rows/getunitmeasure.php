<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Origin, Content-Type,X-Requested-With, X-Auth-Token, Access-Control-Allow-Headers, Authorization');
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Max-Age: 3600");

    // include database and object files
    include_once '../config/database.php';
    include_once '../objects/estimate_rows.php';

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare product object
    $estimate_rows = new Estimate_rows($db);

    $data = json_decode(file_get_contents("php://input"));
    $estimate_rows->user_id=$data->user_id;
    // read the details of product to be edited
    $stmt=$estimate_rows->getUnitMeasureText();
    $num=$stmt->rowCount();
    if($num>0){
        $estimate_rows_arr=array();
        $estimate_rows_arr["records"]=array();

        while ($row=$stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $estimate_rows_item = array(
                "unit_measure" => $unit_measure
            );
            array_push($estimate_rows_arr["records"], $estimate_rows_item);
        }
        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($estimate_rows_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user product does not exist
        echo json_encode(array("message" => "FAIL"));
    }
?>
