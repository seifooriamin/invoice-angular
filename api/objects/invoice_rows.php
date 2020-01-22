<?php


class Invoice_rows
{
    private $conn;
    private $table_name="invoice_rows";

    public $id;
    public $inx;
    public $invoice_id;
    public $description;
    public $comment;
    public $unit_price;
    public $unit_measure;
    public $total_row_price;
    public $quantity;
    public $created;
    public $user_id;

    public function __construct($db)
    {
        $this->conn=$db;
    }

    function read(){
        $query="SELECT ir.inx, ir.invoice_id, ir.description, ir.comment, ir.unit_price, ir.unit_measure, ir.quantity, ir.user_id
                FROM " . $this->table_name . " ir
                ORDER BY ir.invoice_id, ir.inx  ASC";
        $stmt=$this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }
    function readPerInvoice(){
        $query="SELECT inx,invoice_id,description,comment,unit_price,unit_measure,quantity,user_id
                FROM " . $this->table_name . " WHERE invoice_id = ? ORDER BY inx ASC";

        $stmt=$this->conn->prepare($query);

        $stmt->bindParam(1, $this->invoice_id);

        $stmt->execute();

        return $stmt;
    }
    function countPerInvoice(){
        $query="SELECT COUNT(*) as total_rows FROM " . $this->table_name . " WHERE invoice_id=?";
        $stmt=$this->conn->prepare($query);
        $stmt->bindParam(1,$this->invoice_id);
        $stmt->execute();
        $row=$stmt->fetch(PDO::FETCH_ASSOC);
        return $row["total_rows"];
    }
    function count(){
        $query="SELECT COUNT(*) as total_rows FROM " . $this->table_name . "";
        $stmt=$this->conn->prepare($query);

        $stmt->execute();
        $row=$stmt->fetch(PDO::FETCH_ASSOC);
        return $row["total_rows"];
    }
    function create(){

        // query to insert record
        $query = "INSERT INTO
                        " . $this->table_name . "
                    SET
                    inx=:inx,
                    invoice_id=:invoice_id,
                    description=:description,
                    comment=:comment,
                    unit_price=:unit_price,
                    unit_measure=:unit_measure,
                    quantity=:quantity,
                    user_id=:user_id";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->inx=htmlspecialchars(strip_tags($this->inx));
        $this->invoice_id=htmlspecialchars(strip_tags($this->invoice_id));
        $this->description=htmlspecialchars(strip_tags($this->description));
        $this->comment=htmlspecialchars(strip_tags($this->comment));
        $this->unit_price=htmlspecialchars(strip_tags($this->unit_price));
        $this->unit_measure=htmlspecialchars(strip_tags($this->unit_measure));
        $this->quantity=htmlspecialchars(strip_tags($this->quantity));
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));

        // bind values
        $stmt->bindParam(":inx", $this->inx);
        $stmt->bindParam(":invoice_id", $this->invoice_id);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":comment", $this->comment);
        $stmt->bindParam(":unit_price", $this->unit_price);
        $stmt->bindParam(":unit_measure", $this->unit_measure);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":user_id", $this->user_id);

        if($stmt->execute()){
            return true;
        }
        return false;

    }
    function readOne(){

        // query to read single record
        $query = "SELECT ir.id,ir.inx, ir.invoice_id, ir.description, ir.comment, ir.unit_price, ir.unit_measure, ir.quantity, ir.user_id, ir.created
                FROM " . $this->table_name . " ir
                WHERE
                    ir.id = ?
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
        $this->invoice_id = $row['invoice_id'];
        $this->inx = $row['inx'];
        $this->description = $row['description'];
        $this->comment = $row['comment'];
        $this->unit_price = $row['unit_price'];
        $this->unit_measure = $row['unit_measure'];
        $this->quantity = $row['quantity'];
        $this->created = $row['created'];
        $this->user_id = $row['user_id'];
    }
    function update(){

        // update query
        $query = "UPDATE " . $this->table_name . " SET
                        inx = :inx,
                        description = :description,
                        comment = :comment,
                        unit_price = :unit_price,
                        unit_measure = :unit_measure,
                        quantity = :quantity,
                        user_id = :user_id
                    WHERE
                        id = :id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->inx=htmlspecialchars(strip_tags($this->inx));
        $this->description=htmlspecialchars(strip_tags($this->description));
        $this->comment=htmlspecialchars(strip_tags($this->comment));
        $this->unit_price=htmlspecialchars(strip_tags($this->unit_price));
        $this->unit_measure=htmlspecialchars(strip_tags($this->unit_measure));
        $this->quantity=htmlspecialchars(strip_tags($this->quantity));
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));
        $this->id=htmlspecialchars(strip_tags($this->id));

        // bind new values
        $stmt->bindParam(":inx", $this->inx);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":comment", $this->comment);
        $stmt->bindParam(":unit_price", $this->unit_price);
        $stmt->bindParam(":unit_measure", $this->unit_measure);
        $stmt->bindParam(":quantity", $this->quantity);
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":id", $this->id);

        // execute the query
        if($stmt->execute()){
            return true;
        }
//        $errors = $stmt->errorInfo();
//        echo($errors[2]);
        return false;
    }
    function delete(){

        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->id=htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);
        if($stmt->execute()){
            return true;
        }
        return false;
    }
    function deleteByInvoiceID(){

        $query = "DELETE FROM " . $this->table_name . " WHERE invoice_id = ?";
        $stmt = $this->conn->prepare($query);
        $this->invoice_id=htmlspecialchars(strip_tags($this->invoice_id));
        $stmt->bindParam(1, $this->invoice_id);
        if($stmt->execute()){
            return true;
        }
        return false;
    }


}
