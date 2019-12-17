<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/core.php';
include_once '../shared/utilities.php';
include_once '../config/database.php';
include_once '../objects/estimate.php';
 
// utilities
$utilities = new Utilities();
 
// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$estimate = new Estimate($db);
 
// query products
$stmt = $estimate->readPaging($from_record_num, $records_per_page);
$num = $stmt->rowCount();
 
// check if more than 0 record found
if($num>0){
 
    // products array
    $estimate_arr=array();
    $estimate_arr["records"]=array();
    $estimate_arr["paging"]=array();
 
    // retrieve our table contents
    // fetch() is faster than fetchAll()
    // http://stackoverflow.com/questions/2770630/pdofetchall-vs-pdofetch-in-a-loop
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        // extract row
        // this will make $row['name'] to
        // just $name only
        extract($row);
 
        $estimate_item=array(
            "id" => $id,
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
            "total_price" => $total_price,
            "gst" => $gst,
            "created" => $created,
            "user_id" => $user_id,
            "user_full_name" => $user_first_name." ".$user_last_name,
        );
 
        array_push($estimate_arr["records"], $estimate_item);
    }
 
 
    // include paging
    $total_rows=$estimate->count();
    $page_url="{$home_url}estimate/read_paging.php?";
    $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
    $estimate_arr["paging"]=$paging;
 
    // set response code - 200 OK
    http_response_code(200);
 
    // make it json format
    echo json_encode($estimate_arr);
}
 
else{
 
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user products does not exist
    echo json_encode(
        array("message" => "No estimate found.")
    );
}
?>
