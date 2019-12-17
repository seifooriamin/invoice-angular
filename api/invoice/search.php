<?php
    // required headers
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");

    // include database and object files
    include_once '../shared/utilities.php';
    include_once '../config/core.php';
    include_once '../config/database.php';
    include_once '../objects/invoice.php';

    // utilities
    $utilities = new Utilities();

    // instantiate database and product object
    $database = new Database();
    $db = $database->getConnection();

    // initialize object
    $invoice = new Invoice($db);

    // get keywords
    $keywords=isset($_GET["s"]) ? $_GET["s"] : "";

    // query products
    $stmt = $invoice->search($keywords,$from_record_num, $records_per_page);
    $num = $stmt->rowCount();
    // check if more than 0 record found
    if($num>0){

        // products array
        $invoice_arr=array();
        $invoice_arr["records"]=array();
        $invoice_arr["paging"]=array();

        // retrieve our table contents
        // fetch() is faster than fetchAll()
        // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            // extract row
            // this will make $row['name'] to
            // just $name only
            extract($row);

            $invoice_item=array(
                "invoice_number" => $invoice_number,
                "date" => $date,
                "customer_id" => $customer_id,
                "customer_name" => $customer_name,
                "customer_address" => $customer_address,
                "company_id" => $company_id,
                "company_name" => $company_name,
                "company_address" => $company_address,
                "company_email" => $company_email,
                "company_phone" => $company_phone,
                "company_business_no" => $company_business_no,
                "company_gst_no" => $company_gst_no,
                "company_website" => $company_website,
                "company_logo_link" => $company_logo_link,
                "sub_total" => $sub_total,
                "addition1" => $addition1,
                "addition2" => $addition2,
                "addition3" => $addition3,
                "deduction1" => $deduction1,
                "deduction2" => $deduction2,
                "total" => $total,
                "note" => $note,
                "created" => $created,
                "user_id" => $user_id,
                "user_full_name" => $user_first_name . " " . $user_last_name,
                "year" => $year
            );

            array_push($invoice_arr["records"], $invoice_item);
        }

        // include paging
        $total_rows=$invoice->count_search($keywords);
        $page_url="{$home_url}invoice/search.php?s=".$keywords."&";
        $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
        $invoice_arr["paging"]=$paging;

        // set response code - 200 OK
        http_response_code(200);

        // show products data
        echo json_encode($invoice_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user no products found
        echo json_encode(
            array("message" => "No invoice found.")
        );
    }
?>
