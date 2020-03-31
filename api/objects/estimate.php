<?php


class Estimate
{
    private $conn;
    private $table_name="estimate";

    public $id;
    public $estimate_number;
    public $date;
    public $customer_id;
    public $customer_name;
    public $customer_address;
    public $customer_phone;
    public $customer_email;
    public $company_id;
    public $company_name;
    public $company_address;
    public $company_phone;
    public $company_email;
    public $company_website;
    public $company_business_no;
    public $company_gst_no;
    public $company_logo_link;
    public $sub_total;
    public $addition1;
    public $addition2;
    public $addition3;
    public $deduction1;
    public $deduction2;
    public $total;
    public $note;
    public $created;
    public $user_id;
    public $user_first_name;
    public $user_last_name;

    public function __construct($db)
    {
        $this->conn=$db;
    }

    function readByUser(){
        $query="SELECT u.first_name as user_first_name, u.last_name as user_last_name, cu.name as customer_name,
                       cu.address as customer_address, cu.phone as customer_phone, cu.email as customer_email,
                       co.name as company_name, co.address as company_address, co.email as company_email, co.phone as company_phone,
                       co.business_no as company_business_no, co.gst_no as company_gst_no, co.website as company_website,
                       co.logo_link as company_logo_link, e.id, e.estimate_number, e.date, e.company_id, e.customer_id,
                       e.addition1, e.addition2, e.addition3, e.deduction1, e.deduction2, e.note, e.created, e.user_id,
                       (SELECT SUM((quantity*unit_price)) FROM estimate_rows er WHERE e.id = er.estimate_id) as sub_total,
                       ((SELECT SUM((quantity*unit_price)) FROM estimate_rows er WHERE e.id = er.estimate_id)-
                       (e.deduction1+e.deduction2)+(e.addition1+e.addition2+e.addition3)) as total
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
                WHERE e.user_id = ?    
                GROUP BY e.id            
                ORDER BY e.created DESC";
        $stmt=$this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->execute();
//        $errors = $stmt->errorInfo();
//        echo($errors[2]);
        return $stmt;
    }

    function create(){

        // query to insert record
        $query = "INSERT INTO
                        " . $this->table_name . "
                    SET
                        estimate_number=:estimate_number,
                        date=:date,
                        customer_id=:customer_id,
                        company_id=:company_id,
                        addition1=:addition1,
                        addition2=:addition2,
                        addition3=:addition3,
                        deduction1=:deduction1,
                        deduction2=:deduction2,
                        note=:note,
                        user_id=:user_id";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->estimate_number=htmlspecialchars(strip_tags($this->estimate_number));
        $this->date=htmlspecialchars(strip_tags($this->date));
        $this->customer_id=htmlspecialchars(strip_tags($this->customer_id));
        $this->company_id=htmlspecialchars(strip_tags($this->company_id));
        $this->addition1=htmlspecialchars(strip_tags($this->addition1));
        $this->addition2=htmlspecialchars(strip_tags($this->addition2));
        $this->addition3=htmlspecialchars(strip_tags($this->addition3));
        $this->deduction1=htmlspecialchars(strip_tags($this->deduction1));
        $this->deduction2=htmlspecialchars(strip_tags($this->deduction2));
        $this->note=htmlspecialchars(strip_tags($this->note));
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));

        // bind values
        $stmt->bindParam(":estimate_number", $this->estimate_number);
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":customer_id", $this->customer_id);
        $stmt->bindParam(":company_id", $this->company_id);
        $stmt->bindParam(":addition1", $this->addition1);
        $stmt->bindParam(":addition2", $this->addition2);
        $stmt->bindParam(":addition3", $this->addition3);
        $stmt->bindParam(":deduction1", $this->deduction1);
        $stmt->bindParam(":deduction2", $this->deduction2);
        $stmt->bindParam(":note", $this->note);
        $stmt->bindParam(":user_id", $this->user_id);

        // execute query
        if($stmt->execute()){
            return true;
        }
        $errors = $stmt->errorInfo();
        echo($errors[2]);
        return false;


    }
    function getEstimateNumber(){
        $query="SELECT estimate_number, id FROM ". $this->table_name .  " WHERE user_id = ? ORDER BY id DESC LIMIT 1";

        $stmt=$this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->execute();
        $row=$stmt->fetch(PDO::FETCH_ASSOC);
        $this->estimate_number = $row["estimate_number"];
        $this->id = $row["id"];
    }
    function readOne(){

        // query to read single record
        $query = "SELECT u.first_name as user_first_name, u.last_name as user_last_name, cu.name as customer_name, cu.address as customer_address,
                       co.name as company_name, co.address as company_address, co.email as company_email, co.phone as company_phone,
                       co.business_no as company_business_no, co.gst_no as company_gst_no, co.website as company_website,
                       co.logo_link as company_logo_link, e.id, e.estimate_number, e.date, e.company_id, e.customer_id,
                       e.addition1, e.addition2, e.addition3, e.deduction1, e.deduction2, e.note, e.created, e.user_id
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
                        BINARY e.id = ? && e.user_id = ?
                    LIMIT
                        0,1";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind id of product to be updated
        $stmt->bindParam(1, $this->id);
        $stmt->bindParam(2, $this->user_id);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->estimate_number = $row['estimate_number'];
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
        $this->addition1 = $row['addition1'];
        $this->addition2 = $row['addition2'];
        $this->addition3 = $row['addition3'];
        $this->deduction1 = $row['deduction1'];
        $this->deduction2 = $row['deduction2'];
        $this->note = $row['note'];
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
                        addition1 = :addition1,
                        addition2 = :addition2,
                        addition3 = :addition3,
                        deduction1 = :deduction1,
                        deduction2 = :deduction2,
                        note = :note,
                        user_id = :user_id
                    WHERE
                        id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->date=htmlspecialchars(strip_tags($this->date));
        $this->customer_id=htmlspecialchars(strip_tags($this->customer_id));
        $this->company_id=htmlspecialchars(strip_tags($this->company_id));
        $this->addition1=htmlspecialchars(strip_tags($this->addition1));
        $this->addition2=htmlspecialchars(strip_tags($this->addition2));
        $this->addition3=htmlspecialchars(strip_tags($this->addition3));
        $this->deduction1=htmlspecialchars(strip_tags($this->deduction1));
        $this->deduction2=htmlspecialchars(strip_tags($this->deduction2));
        $this->note=htmlspecialchars(strip_tags($this->note));
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":customer_id", $this->customer_id);
        $stmt->bindParam(":company_id", $this->company_id);
        $stmt->bindParam(":addition1", $this->addition1);
        $stmt->bindParam(":addition2", $this->addition2);
        $stmt->bindParam(":addition3", $this->addition3);
        $stmt->bindParam(":deduction1", $this->deduction1);
        $stmt->bindParam(":deduction2", $this->deduction2);
        $stmt->bindParam(":note", $this->note);
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

}
