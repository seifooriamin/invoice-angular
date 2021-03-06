<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET");
    header("Access-Control-Max-Age: 3600");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


    // include database and object files
    include_once '../shared/utilities.php';
    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/companies.php';

    // utilities
    $utilities = new Utilities();

    // instantiate database and product object
    $database = new Database();
    $db = $database->getConnection();

    // initialize object
    $companies = new Companies($db);

    // get keywords
    $keywords=isset($_GET["s"]) ? $_GET["s"] : "";

    // query products
    $stmt = $companies->search($keywords,$from_record_num, $records_per_page);
    $num = $stmt->rowCount();
    // check if more than 0 record found
    if($num>0){

        // products array
        $companies_arr=array();
        $companies_arr["records"]=array();
        $companies_arr["paging"]=array();

        // retrieve our table contents
        // fetch() is faster than fetchAll()
        // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            // extract row
            // this will make $row['name'] to
            // just $name only
            extract($row);

            $companies_item=array(
                "id" => $id,
                "name" => $name,
                "address" => $address,
                "phone" => $phone,
                "business_no" => $business_no,
                "gst_no" => $gst_no,
                "website" => $website,
                "email" => $email,
                "logo_link" => $logo_link,
                "user_id" => $user_id,
                "user_full_name" => $first_name." ".$last_name,
                "created" => $created
            );

            array_push($companies_arr["records"], $companies_item);
        }

        // include paging
        $total_rows=$companies->count_search($keywords);
        $page_url="{$home_url}companies/search.php?s=".$keywords."&";
        $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
        $companies_arr["paging"]=$paging;

        // set response code - 200 OK
        http_response_code(200);

        // show products data
        echo json_encode($companies_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user no products found
        echo json_encode(
            array("message" => "No company found.")
        );
    }
?>
