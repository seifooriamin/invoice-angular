<?php


class Invoice
{
    private $conn;
    private $table_name="invoice";

    public $id;
    public $invoice_number;
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
    public $year;

    public function __construct($db)
    {
        $this->conn=$db;
    }

    function read(){
        $query="SELECT u.first_name as user_first_name, u.last_name as user_last_name, cu.name as customer_name, cu.address as customer_address,
                       co.name as company_name, co.address as company_address, co.email as company_email, co.phone as company_phone,
                       co.business_no as company_business_no, co.gst_no as company_gst_no, co.website as company_website,
                       co.logo_link as company_logo_link, i.id, i.invoice_number, i.date, i.company_id, i.customer_id,
                       i.addition1, i.addition2, i.addition3, i.deduction1, i.deduction2, i.note, i.created, i.user_id, i.year,
                       (SELECT SUM((quantity*unit_price)) FROM invoice_rows ir WHERE i.id = ir.invoice_id) as sub_total,
                       ((SELECT SUM((quantity*unit_price)) FROM invoice_rows ir WHERE i.id = ir.invoice_id)-
                       (i.deduction1+i.deduction2)+(i.addition1+i.addition2+i.addition3)) as total
                FROM " . $this->table_name . " i
                LEFT JOIN
                    users u
                    ON i.user_id=u.id
                LEFT JOIN
                    customers cu
                    ON i.customer_id=cu.id
                LEFT JOIN
                    companies co
                    ON i.company_id=co.id
                GROUP BY i.id            
                ORDER BY i.created DESC";
        $stmt=$this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    function readByUser(){
        $query="SELECT u.first_name as user_first_name, u.last_name as user_last_name, cu.name as customer_name,
                       cu.address as customer_address, cu.phone as customer_phone, cu.email as customer_email,
                       co.name as company_name, co.address as company_address, co.email as company_email, co.phone as company_phone,
                       co.business_no as company_business_no, co.gst_no as company_gst_no, co.website as company_website,
                       co.logo_link as company_logo_link, i.id, i.invoice_number, i.date, i.company_id, i.customer_id,
                       i.addition1, i.addition2, i.addition3, i.deduction1, i.deduction2, i.note, i.created, i.user_id, i.year,
                       (SELECT SUM((quantity*unit_price)) FROM invoice_rows ir WHERE i.id = ir.invoice_id) as sub_total,
                       ((SELECT SUM((quantity*unit_price)) FROM invoice_rows ir WHERE i.id = ir.invoice_id)-
                       (i.deduction1+i.deduction2)+(i.addition1+i.addition2+i.addition3)) as total
                FROM " . $this->table_name . " i
                LEFT JOIN
                    users u
                    ON i.user_id=u.id
                LEFT JOIN
                    customers cu
                    ON i.customer_id=cu.id
                LEFT JOIN
                    companies co
                    ON i.company_id=co.id
                WHERE i.user_id = ?    
                GROUP BY i.id            
                ORDER BY i.created DESC";
        $stmt=$this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
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
        $query="SELECT COUNT(*) as total_rows FROM " . $this->table_name . " i
                    LEFT JOIN
                        users u
                        ON i.user_id=u.id
                    LEFT JOIN
                        customers cu
                        ON i.customer_id=cu.id
                    LEFT JOIN
                        companies co
                        ON i.company_id=co.id    
                    WHERE
                        i.invoice_number LIKE ? OR cu.name LIKE ? OR co.name LIKE ? OR i.year LIKE ?";

        $stmt=$this->conn->prepare($query);

        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);
        $stmt->bindParam(4, $keywords);

        $stmt->execute();
        $row=$stmt->fetch(PDO::FETCH_ASSOC);
        return $row["total_rows"];
    }
    function create(){

        // query to insert record
        $query = "INSERT INTO
                        " . $this->table_name . "
                    SET
                        invoice_number=:invoice_number,
                        date=:date,
                        customer_id=:customer_id,
                        company_id=:company_id,
                        addition1=:addition1,
                        addition2=:addition2,
                        addition3=:addition3,
                        deduction1=:deduction1,
                        deduction2=:deduction2,
                        note=:note,
                        user_id=:user_id,
                        year=:year";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->invoice_number=htmlspecialchars(strip_tags($this->invoice_number));
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
        $this->year=htmlspecialchars(strip_tags($this->year));

        // bind values
        $stmt->bindParam(":invoice_number", $this->invoice_number);
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
        $stmt->bindParam(":year", $this->year);

        // execute query
        if($stmt->execute()){
            return true;
        }
        $errors = $stmt->errorInfo();
        echo($errors[2]);
        return false;


    }
    function invoice_number_generator(){
        $query="SELECT MAX(no) as current_invoice FROM ". $this->table_name .  " WHERE year=?";
        $current_year= date("Y");

        $stmt=$this->conn->prepare($query);

        $stmt->bindParam(1,$current_year);

        $stmt->execute();
        $row=$stmt->fetch(PDO::FETCH_ASSOC);
        return ++$row["current_invoice"];
    }
    function getInvoiceNumber(){
        $query="SELECT invoice_number, id FROM ". $this->table_name .  " WHERE user_id = ? ORDER BY id DESC LIMIT 1";

        $stmt=$this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->execute();
        $row=$stmt->fetch(PDO::FETCH_ASSOC);
        $this->invoice_number = $row["invoice_number"];
        $this->id = $row["id"];
    }
    function readOne(){

        // query to read single record
        $query = "SELECT u.first_name as user_first_name, u.last_name as user_last_name, cu.name as customer_name, cu.address as customer_address,
                       co.name as company_name, co.address as company_address, co.email as company_email, co.phone as company_phone,
                       co.business_no as company_business_no, co.gst_no as company_gst_no, co.website as company_website,
                       co.logo_link as company_logo_link, i.id, i.invoice_number, i.date, i.company_id, i.customer_id, i.sub_total,
                       i.addition1, i.addition2, i.addition3, i.deduction1, i.deduction2, i.total, i.note, i.created, i.user_id, i.year
                FROM " . $this->table_name . " i
                LEFT JOIN
                    users u
                    ON i.user_id=u.id
                LEFT JOIN
                    customers cu
                    ON i.customer_id=cu.id
                LEFT JOIN
                    companies co
                    ON i.company_id=co.id   
                    WHERE
                        i.id = ?
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
        $this->invoice_number = $row['invoice_number'];
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
        $this->sub_total = $row['sub_total'];
        $this->addition1 = $row['addition1'];
        $this->addition2 = $row['addition2'];
        $this->addition3 = $row['addition3'];
        $this->deduction1 = $row['deduction1'];
        $this->deduction2 = $row['deduction2'];
        $this->total = $row['total'];
        $this->note = $row['note'];
        $this->created = $row['created'];
        $this->user_id = $row['user_id'];
        $this->user_first_name = $row['user_first_name'];
        $this->user_last_name = $row['user_last_name'];
        $this->year = $row['year'];
    }
    function update(){

        // update query
        $query = "UPDATE " . $this->table_name . " SET
                        date = :date,
                        customer_id = :customer_id,
                        company_id = :company_id,
                        sub_total = :sub_total,
                        addition1 = :addition1,
                        addition2 = :addition2,
                        addition3 = :addition3,
                        deduction1 = :deduction1,
                        deduction2 = :deduction2,
                        total = :total,
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
        $this->sub_total=htmlspecialchars(strip_tags($this->sub_total));
        $this->addition1=htmlspecialchars(strip_tags($this->addition1));
        $this->addition2=htmlspecialchars(strip_tags($this->addition2));
        $this->addition3=htmlspecialchars(strip_tags($this->addition3));
        $this->deduction1=htmlspecialchars(strip_tags($this->deduction1));
        $this->deduction2=htmlspecialchars(strip_tags($this->deduction2));
        $this->total=htmlspecialchars(strip_tags($this->total));
        $this->note=htmlspecialchars(strip_tags($this->note));
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(":date", $this->date);
        $stmt->bindParam(":customer_id", $this->customer_id);
        $stmt->bindParam(":company_id", $this->company_id);
        $stmt->bindParam(":sub_total", $this->sub_total);
        $stmt->bindParam(":addition1", $this->addition1);
        $stmt->bindParam(":addition2", $this->addition2);
        $stmt->bindParam(":addition3", $this->addition3);
        $stmt->bindParam(":deduction1", $this->deduction1);
        $stmt->bindParam(":deduction2", $this->deduction2);
        $stmt->bindParam(":total", $this->total);
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
    function search($keywords,$from_record_num, $records_per_page){

        // select all query
        $query = "SELECT u.first_name as user_first_name, u.last_name as user_last_name, cu.name as customer_name, cu.address as customer_address,
                       co.name as company_name, co.address as company_address, co.email as company_email, co.phone as company_phone,
                       co.business_no as company_business_no, co.gst_no as company_gst_no, co.website as company_website,
                       co.logo_link as company_logo_link, i.id, i.invoice_number, i.date, i.company_id, i.customer_id, i.sub_total,
                       i.addition1, i.addition2, i.addition3, i.deduction1, i.deduction2, i.total, i.note, i.created, i.user_id, i.year
                    FROM
                        " . $this->table_name . " i
                    LEFT JOIN
                        users u
                        ON i.user_id=u.id
                    LEFT JOIN
                        customers cu
                        ON i.customer_id=cu.id
                    LEFT JOIN
                        companies co
                        ON i.company_id=co.id    
                    WHERE
                        i.invoice_number LIKE ? OR cu.name LIKE ? OR co.name LIKE ? OR i.year LIKE ?
                    ORDER BY
                        i.created DESC
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
        $stmt->bindParam(4, $keywords);
        $stmt->bindParam(5, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(6, $records_per_page, PDO::PARAM_INT);

        // execute query
        $stmt->execute();

        return $stmt;
    }
    public function readPaging($from_record_num, $records_per_page){

        // select query
        $query = "SELECT
                       u.first_name as user_first_name, u.last_name as user_last_name, cu.name as customer_name, cu.address as customer_address,
                       co.name as company_name, co.address as company_address, co.email as company_email, co.phone as company_phone,
                       co.business_no as company_business_no, co.gst_no as company_gst_no, co.website as company_website,
                       co.logo_link as company_logo_link, i.id, i.invoice_number, i.date, i.company_id, i.customer_id, i.sub_total,
                       i.addition1, i.addition2, i.addition3, i.deduction1, i.deduction2, i.total, i.note, i.created, i.user_id, i.year,
                    FROM
                        " . $this->table_name . " i
                   LEFT JOIN
                    users u
                    ON i.user_id=u.id
                   LEFT JOIN
                    customers cu
                    ON i.customer_id=cu.id
                   LEFT JOIN
                    companies co
                    ON i.company_id=co.id
                   GROUP BY i.id    
                   ORDER BY i.created DESC
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
