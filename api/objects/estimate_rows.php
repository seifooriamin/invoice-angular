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

    function readPerEstimate(){
        $query="SELECT inx,estimate_id,description,comment,unit_price,unit_measure,quantity,user_id,id
                FROM " . $this->table_name . " WHERE estimate_id = ? ORDER BY inx ASC";

        $stmt=$this->conn->prepare($query);

        $stmt->bindParam(1, $this->estimate_id);

        $stmt->execute();

        return $stmt;
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

    function deleteByEstimateID(){

        $query = "DELETE FROM " . $this->table_name . " WHERE estimate_id = ?";
        $stmt = $this->conn->prepare($query);
        $this->estimate_id=htmlspecialchars(strip_tags($this->estimate_id));
        $stmt->bindParam(1, $this->estimate_id);
        if($stmt->execute()){
            return true;
        }
        return false;
    }
    function getDescriptionText(){
        $query="SELECT description FROM " . $this->table_name . " WHERE user_id = ? GROUP BY description";
        $stmt=$this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->execute();
        return $stmt;
    }
    function getCommentText(){
        $query="SELECT comment FROM " . $this->table_name . " WHERE user_id = ? GROUP BY comment";
        $stmt=$this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->execute();
        return $stmt;
    }
    function getUnitMeasureText(){
        $query="SELECT unit_measure FROM " . $this->table_name . " WHERE user_id = ? GROUP BY unit_measure";
        $stmt=$this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->execute();
        return $stmt;
    }

}
