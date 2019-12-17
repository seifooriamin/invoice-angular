<?php


class Estimate_rows
{
    private $conn;
    private $table_name="estimate_rows";

    public $id;
    public $inx;
    public $estimate_id;
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
        $query="SELECT er.inx, er.estimate_id, er.description, er.comment, er.unit_price, er.unit_measure, er.quantity, er.user_id
                FROM " . $this->table_name . " er
                ORDER BY er.estimate_id, er.inx  ASC";
        $stmt=$this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function readPerEstimate(){
        $query="SELECT inx,estimate_id,description,comment,unit_price,unit_measure,quantity,user_id
                FROM " . $this->table_name . " WHERE estimate_id = ? ORDER BY inx ASC";

        $stmt=$this->conn->prepare($query);

        $stmt->bindParam(1, $this->estimate_id);

        $stmt->execute();

        return $stmt;
    }

    function countPerEstimate(){
        $query="SELECT COUNT(*) as total_rows FROM " . $this->table_name . " WHERE estimate_id=?";
        $stmt=$this->conn->prepare($query);
        $stmt->bindParam(1,$this->estimate_id);
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
                    estimate_id=:estimate_id,
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
        $this->estimate_id=htmlspecialchars(strip_tags($this->estimate_id));
        $this->description=htmlspecialchars(strip_tags($this->description));
        $this->comment=htmlspecialchars(strip_tags($this->comment));
        $this->unit_price=htmlspecialchars(strip_tags($this->unit_price));
        $this->unit_measure=htmlspecialchars(strip_tags($this->unit_measure));
        $this->quantity=htmlspecialchars(strip_tags($this->quantity));
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));

        // bind values
        $stmt->bindParam(":inx", $this->inx);
        $stmt->bindParam(":estimate_id", $this->estimate_id);
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
        $query = "SELECT er.id,er.inx, er.estimate_id, er.description, er.comment, er.unit_price, er.unit_measure, er.quantity, er.user_id, er.created
                FROM " . $this->table_name . " er
                WHERE
                    er.id = ?
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
        $this->estimate_id = $row['estimate_id'];
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
