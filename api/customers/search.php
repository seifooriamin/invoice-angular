<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    // include database and object files
    include_once '../shared/utilities.php';
    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/customers.php';

    // utilities
    $utilities = new Utilities();

    // instantiate database and product object
    $database = new Database();
    $db = $database->getConnection();

    // initialize object
    $customers = new Customers($db);

    // get keywords
    $keywords=isset($_GET["s"]) ? $_GET["s"] : "";

    // query products
    $stmt = $customers->search($keywords,$from_record_num, $records_per_page);
    $num = $stmt->rowCount();

    // check if more than 0 record found
    if($num>0){

        // products array
        $customers_arr=array();
        $customers_arr["records"]=array();
        $customers_arr["paging"]=array();

        // retrieve our table contents
        // fetch() is faster than fetchAll()
        // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            // extract row
            // this will make $row['name'] to
            // just $name only
            extract($row);

            $customers_item=array(
                "id" => $id,
                "name" => $name,
                "address" => $address,
                "user_id" => $user_id,
                "user_full_name" => $first_name." ".$last_name,
                "created" => $created
            );

            array_push($customers_arr["records"], $customers_item);
        }

        // include paging
        $total_rows=$customers->count_search($keywords);
        $page_url="{$home_url}customers/search.php?s=".$keywords."&";
        $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
        $customers_arr["paging"]=$paging;

        // set response code - 200 OK
        http_response_code(200);

        // show products data
        echo json_encode($customers_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user no products found
        echo json_encode(
            array("message" => "No customer found.")
        );
    }
?>
