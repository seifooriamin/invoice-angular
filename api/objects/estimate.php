<?php


class Estimate
{
    private $conn;
    private $table_name="estimate";

    public $id;
    public $date;
    public $customer_id;
    public $customer_name;
    public $customer_address;
    public $company_id;
    public $company_name;
    public $company_address;
    public $company_phone;
    public $company_email;
    public $company_website;
    public $company_business_no;
    public $company_gst_no;
    public $company_logo_link;
    public $total_price;
    public $gst;
    public $created;
    public $user_id;
    public $user_first_name;
    public $user_last_name;

    public function __construct($db)
    {
        $this->conn=$db;
    }

    function read(){
        $query="SELECT u.first_name as user_first_name, u.last_name as user_last_name, cu.name as customer_name, cu.address as customer_address,
                       co.name as company_name, co.address as company_address, co.email as company_email, co.phone as company_phone,
                       co.business_no as company_business_no, co.gst_no as company_gst_no, co.website as company_website,
                       co.logo_link as company_logo_link, e.id, e.date, e.company_id, e.customer_id, e.total_price,
                       e.gst, e.created, e.user_id
                FROM " . $this->table_name . " e
                LEFT JOIN
                    users u
                    ON e.user_id=u.id
                LEFT JOIN
                    customers cu
                    ON e.customer_id=cu.id
                LEFT JOIN
                    companies co
                    ON e.company_id=co.id        
                ORDER BY e.created DESC";
        $stmt=$this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function count(){
        $query="SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";
        $stmt=$this->conn->prepare($query);

        $stmt->execute();
        $row=$stmt->fetch(PDO::FETCH_ASSOC);
        return $row["total_rows"];

    }

    function count_search($keywords){
        $query="SELECT COUNT(*) as total_rows FROM " . $this->table_name . " e
                    LEFT JOIN
                        users u
                        ON e.user_id=u.id
                    LEFT JOIN
                        customers cu
                        ON e.customer_id=cu.id
                    LEFT JOIN
                        companies co
                        ON e.company_id=co.id    
                    WHERE
                        cu.name LIKE ? OR co.name LIKE ?";
        $stmt=$this->conn->prepare($query);

        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);

        $stmt->execute();
        $row=$stmt->fetch(PDO::FETCH_ASSOC);
        return $row["total_rows"];
    }

    function create(){

        // query to insert record
        $query = "INSERT INTO
                        " . $this->table_name . "
                    SET
                        date=:date,
                        customer_id=:customer_id,
                        company_id=:company_id,
                        total_price=:total_price,
                        gst=:gst,
                        user_id=:user_id";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->date=htmlspecialchars(strip_tags($this->date));
        $this->customer_id=htmlspecialchars(strip_tags($this->customer_id));
        $this->company_id=htmlspecialchars(strip_tags($this->company_id));
        $this->total_price=htmlspecialchars(strip_tags($this->total_price));
        $this->gst=htmlspecialchars(strip_tags($this->gst));
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));


        // bind values
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":customer_id", $this->customer_id);
        $stmt->bindParam(":company_id", $this->company_id);
        $stmt->bindParam(":total_price", $this->total_price);
        $stmt->bindParam(":gst", $this->gst);
        $stmt->bindParam(":user_id", $this->user_id);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;

    }

    function readOne(){

        // query to read single record
        $query = "SELECT u.first_name as user_first_name, u.last_name as user_last_name, cu.name as customer_name, cu.address as customer_address,
                       co.name as company_name, co.address as company_address, co.email as company_email, co.phone as company_phone,
                       co.business_no as company_business_no, co.gst_no as company_gst_no, co.website as company_website,
                       co.logo_link as company_logo_link, e.id, e.date, e.company_id, e.customer_id, e.total_price,
                       e.gst, e.created, e.user_id
                FROM " . $this->table_name . " e
                LEFT JOIN
                    users u
                    ON e.user_id=u.id
                LEFT JOIN
                    customers cu
                    ON e.customer_id=cu.id
                LEFT JOIN
                    companies co
                    ON e.company_id=co.id   
                    WHERE
                        e.id = ?
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
        $this->date = $row['date'];
        $this->customer_id = $row['customer_id'];
        $this->customer_name = $row['customer_name'];
        $this->customer_address = $row['customer_address'];
        $this->company_id = $row['company_id'];
        $this->company_name = $row['company_name'];
        $this->company_address = $row['company_address'];
        $this->company_email = $row['company_email'];
        $this->company_phone = $row['company_phone'];
        $this->company_business_no = $row['company_business_no'];
        $this->company_gst_no = $row['company_gst_no'];
        $this->company_website = $row['company_website'];
        $this->company_logo_link = $row['company_logo_link'];
        $this->total_price = $row['total_price'];
        $this->gst = $row['gst'];
        $this->created = $row['created'];
        $this->user_id = $row['user_id'];
        $this->user_first_name = $row['user_first_name'];
        $this->user_last_name = $row['user_last_name'];
    }

    function update(){

        // update query
        $query = "UPDATE " . $this->table_name . " SET
                        date = :date,
                        customer_id = :customer_id,
                        company_id = :company_id,
                        total_price = :total_price,
                        gst = :gst,
                        user_id = :user_id
                    WHERE
                        id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->date=htmlspecialchars(strip_tags($this->date));
        $this->customer_id=htmlspecialchars(strip_tags($this->customer_id));
        $this->company_id=htmlspecialchars(strip_tags($this->company_id));
        $this->total_price=htmlspecialchars(strip_tags($this->total_price));
        $this->gst=htmlspecialchars(strip_tags($this->gst));
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":customer_id", $this->customer_id);
        $stmt->bindParam(":company_id", $this->company_id);
        $stmt->bindParam(":total_price", $this->total_price);
        $stmt->bindParam(":gst", $this->gst);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":id", $this->id);

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
        $query = "SELECT u.first_name as user_first_name, u.last_name as user_last_name, cu.name as customer_name, cu.address as customer_address,
                       co.name as company_name, co.address as company_address, co.email as company_email, co.phone as company_phone,
                       co.business_no as company_business_no, co.gst_no as company_gst_no, co.website as company_website,
                       co.logo_link as company_logo_link, e.id, e.date, e.company_id, e.customer_id, e.total_price,
                       e.gst, e.created, e.user_id
                    FROM
                        " . $this->table_name . " e
                    LEFT JOIN
                        users u
                        ON e.user_id=u.id
                    LEFT JOIN
                        customers cu
                        ON e.customer_id=cu.id
                    LEFT JOIN
                        companies co
                        ON e.company_id=co.id    
                    WHERE
                        cu.name LIKE ? OR co.name LIKE ?
                    ORDER BY
                        e.created DESC
                        LIMIT ?, ?";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // bind
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(4, $records_per_page, PDO::PARAM_INT);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    function readPaging($from_record_num, $records_per_page){

        // select query
        $query = "SELECT
                       u.first_name as user_first_name, u.last_name as user_last_name, cu.name as customer_name, cu.address as customer_address,
                       co.name as company_name, co.address as company_address, co.email as company_email, co.phone as company_phone,
                       co.business_no as company_business_no, co.gst_no as company_gst_no, co.website as company_website,
                       co.logo_link as company_logo_link, e.id, e.date, e.company_id, e.customer_id, e.total_price,
                       e.gst, e.created, e.user_id
                    FROM
                        " . $this->table_name . " e
                   LEFT JOIN
                    users u
                    ON e.user_id=u.id
                   LEFT JOIN
                    customers cu
                    ON e.customer_id=cu.id
                   LEFT JOIN
                    companies co
                    ON e.company_id=co.id   
                    ORDER BY e.created DESC
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
}
