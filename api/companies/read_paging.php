<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
 
// include database and object files
include_once '../config/core.php';
include_once '../shared/utilities.php';
include_once '../config/database.php';
include_once '../objects/companies.php';
 
// utilities
$utilities = new Utilities();
 
// instantiate database and product object
$database = new Database();
$db = $database->getConnection();
 
// initialize object
$companies = new Companies($db);
 
// query products
$stmt = $companies->readPaging($from_record_num, $records_per_page);
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
    $total_rows=$companies->count();
    $page_url="{$home_url}companies/read_paging.php?";
    $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
    $companies_arr["paging"]=$paging;
 
    // set response code - 200 OK
    http_response_code(200);
 
    // make it json format
    echo json_encode($companies_arr);
}
 
else{
 
    // set response code - 404 Not found
    http_response_code(404);
 
    // tell the user products does not exist
    echo json_encode(
        array("message" => "No company found.")
    );
}
?>
