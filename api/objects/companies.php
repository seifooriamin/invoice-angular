<?php
class Companies
{
    private $conn;
    private $table_name="companies";

    public $id;
    public $name;
    public $address;
    public $business_no;
    public $phone;
    public $gst_no;
    public $website;
    public $email;
    public $logo_link;
    public $user_id;
    public $user_first_name;
    public $user_last_name;
    public $created;
    public $modified;

    public function __construct($db)
    {
        $this->conn=$db;
    }

    function read(){
        $query="SELECT u.first_name as first_name, u.last_name as last_name ,c.id,c.name,c.address,c.business_no,c.phone,c.gst_no,
                c.website,c.email,c.logo_link,c.user_id,c.created
                FROM " . $this->table_name . " c
                LEFT JOIN
                    users u
                    ON c.user_id=u.id
                ORDER BY c.created DESC";
        $stmt=$this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    function readByUser(){
        $query="SELECT u.first_name as first_name, u.last_name as last_name ,c.id,c.name,c.address,c.business_no,c.phone,c.gst_no,
                c.website,c.email,c.logo_link,c.user_id,c.created
                FROM " . $this->table_name . " c
                LEFT JOIN
                    users u
                    ON c.user_id=u.id
                WHERE c.user_id = ?    
                ORDER BY c.created DESC";
        $stmt=$this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->execute();
        return $stmt;
    }
//    function countByUser(){
//        $query="SELECT COUNT(*) as total_rows FROM " . $this->table_name . " WHERE user_id = ?";
//        $stmt=$this->conn->prepare($query);
//        $stmt->bindParam(1, $this->user_id);
//        $stmt->execute();
//        $row=$stmt->fetch(PDO::FETCH_ASSOC);
//        return $row["total_rows"];
//    }
    function count(){
        $query="SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";
        $stmt=$this->conn->prepare($query);

        $stmt->execute();
        $row=$stmt->fetch(PDO::FETCH_ASSOC);
        return $row["total_rows"];

    }
    function count_search($keywords){
        $query="SELECT COUNT(*) as total_rows FROM " . $this->table_name . " WHERE name LIKE ? OR address LIKE ? OR phone LIKE ?";
        $stmt=$this->conn->prepare($query);

        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);

        $stmt->execute();
        $row=$stmt->fetch(PDO::FETCH_ASSOC);
        return $row["total_rows"];
    }
    function create(){

        // query to insert record
        $query = "INSERT INTO
                        " . $this->table_name . "
                    SET
                        name=:name, address=:address, phone=:phone, business_no=:business_no, gst_no=:gst_no, website=:website, email=:email, logo_link=:logo_link, user_id=:user_id";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->address=htmlspecialchars(strip_tags($this->address));
        $this->phone=htmlspecialchars(strip_tags($this->phone));
        $this->business_no=htmlspecialchars(strip_tags($this->business_no));
        $this->gst_no=htmlspecialchars(strip_tags($this->gst_no));
        $this->website=htmlspecialchars(strip_tags($this->website));
        $this->email=htmlspecialchars(strip_tags($this->email));
        $this->logo_link=htmlspecialchars(strip_tags($this->logo_link));
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));


        // bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":business_no", $this->business_no);
        $stmt->bindParam(":gst_no", $this->gst_no);
        $stmt->bindParam(":website", $this->website);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":logo_link", $this->logo_link);
        $stmt->bindParam(":user_id", $this->user_id);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;

    }

    function readOne(){

        // query to read single record
        $query = "SELECT
                        u.first_name as first_name, u.last_name as last_name , c.id,c.name,c.address,c.business_no,c.phone,c.gst_no,
                        c.website, c.email, c.logo_link, c.user_id, c.created
                    FROM
                        " . $this->table_name . " c
                        LEFT JOIN
                            users u
                        ON c.user_id=u.id
                    WHERE
                        c.id = ?
                    LIMIT
                        0,1";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind id of product to be updated
        $stmt->bindParam(1, $this->id);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->name = $row['name'];
        $this->address = $row['address'];
        $this->phone = $row['phone'];
        $this->business_no = $row['business_no'];
        $this->gst_no = $row['gst_no'];
        $this->website = $row['website'];
        $this->email = $row['email'];
        $this->logo_link = $row['logo_link'];
        $this->user_id = $row['user_id'];
        $this->user_first_name = $row['first_name'];
        $this->user_last_name = $row['last_name'];
        $this->created = $row['created'];
    }
    function update(){

        // update query
        $query = "UPDATE
                        " . $this->table_name . "
                    SET
                        name = :name,
                        address = :address,
                        phone = :phone,
                        business_no = :business_no,
                        gst_no = :gst_no,
                        website = :website,
                        email = :email,
                        logo_link = :logo_link,
                        user_id = :user_id
                    WHERE
                        id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->name=htmlspecialchars(strip_tags($this->name));
        $this->address=htmlspecialchars(strip_tags($this->address));
        $this->phone=htmlspecialchars(strip_tags($this->phone));
        $this->business_no=htmlspecialchars(strip_tags($this->business_no));
        $this->gst_no=htmlspecialchars(strip_tags($this->gst_no));
        $this->website=htmlspecialchars(strip_tags($this->website));
        $this->email=htmlspecialchars(strip_tags($this->email));
        $this->logo_link=htmlspecialchars(strip_tags($this->logo_link));
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':business_no', $this->business_no);
        $stmt->bindParam(':gst_no', $this->gst_no);
        $stmt->bindParam(':website', $this->website);
        $stmt->bindParam(':email', $this->email);
        $stmt->bindParam(':logo_link', $this->logo_link);
        $stmt->bindParam(':user_id', $this->user_id);
        $stmt->bindParam(':id', $this->id);

        // execute the query
        if($stmt->execute()){
            return true;
        }

        return false;
    }
    function delete(){

        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind id of record to delete
        $stmt->bindParam(1, $this->id);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;

    }
    function search($keywords,$from_record_num, $records_per_page){

        // select all query
        $query = "SELECT
                        u.first_name as first_name, u.last_name as last_name , c.id,c.name,c.address,c.business_no,c.phone,c.gst_no,
                        c.website, c.email,c.logo_link,c.user_id,c.created
                    FROM
                        " . $this->table_name . " c
                        LEFT JOIN
                            users u
                                ON c.user_id = u.id
                    WHERE
                        c.name LIKE ? OR c.address LIKE ? OR c.phone LIKE ?
                    ORDER BY
                        c.created DESC
                        LIMIT ?, ?";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // bind
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->bindParam(4, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(5, $records_per_page, PDO::PARAM_INT);

        // execute query
        $stmt->execute();

        return $stmt;
    }
    public function readPaging($from_record_num, $records_per_page){

        // select query
        $query = "SELECT
                        u.first_name as first_name, u.last_name as last_name ,c.id,c.name,c.address,c.business_no,c.phone,c.gst_no,
                        c.website,c.email,c.logo_link,c.user_id,c.created
                    FROM
                        " . $this->table_name . " c
                        LEFT JOIN
                            users u
                                ON c.user_id = u.id
                    ORDER BY c.created DESC
                    LIMIT ?, ?";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind variable values
        $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);

        // execute query
        $stmt->execute();

        // return values from database
        return $stmt;
    }

    function uploadPhoto(){

            $target_directory = "../uploads/";
            $target_file = $target_directory . $this->logo_link;

            if(!is_dir($target_directory)){
                mkdir($target_directory, 0777, true);
            }
                if(move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)){
                    return true;
                }else{
                    return false;
            }

    }

    function imageValidator()
    {

        if ($this->logo_link) {
            $target_directory = "../uploads/";
            $target_file = $target_directory . $this->logo_link;
            $file_type = pathinfo($target_file, PATHINFO_EXTENSION);

            $check = getimagesize($_FILES["file"]["tmp_name"]);
            $allowed_file_types = array("jpg", "jpeg", "png", "gif");

            if ($check == true && in_array($file_type, $allowed_file_types) && $_FILES['file']['size'] <= (2048000)) {
                return true;
            }

        }
        return false;
    }
}
