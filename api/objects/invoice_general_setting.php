<?php


class Invoice_general_setting
{
    private $conn;
    private $table_name="invoice_general_setting";

    public $id;
    public $user_id;
    public $currency;
    public $created;
    public $modified;
    public $deduction1status;
    public $deduction1label;
    public $deduction1type;
    public $deduction1percentage;
    public $deduction2status;
    public $deduction2label;
    public $deduction2type;
    public $deduction2percentage;
    public $addition1status;
    public $addition1label;
    public $addition1type;
    public $addition1percentage;
    public $addition2status;
    public $addition2label;
    public $addition2type;
    public $addition2percentage;
    public $addition3status;
    public $addition3label;
    public $addition3type;
    public $addition3percentage;

    public function __construct($db)
    {
        $this->conn=$db;
    }

    function readOneByUserID(){
        $query="SELECT *
                FROM " . $this->table_name . " igs
                WHERE igs.user_id = ?";
        $stmt=$this->conn->prepare($query);
        $stmt->bindParam(1, $this->user_id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->id = $row['id'];
        $this->user_id = $row['user_id'];
        $this->currency = $row['currency'];
        $this->deduction1status = $row['deduction1status'];
        $this->deduction1label = $row['deduction1label'];
        $this->deduction1type = $row['deduction1type'];
        $this->deduction1percentage = $row['deduction1percentage'];
        $this->deduction2status = $row['deduction2status'];
        $this->deduction2label = $row['deduction2label'];
        $this->deduction2type = $row['deduction2type'];
        $this->deduction2percentage = $row['deduction2percentage'];
        $this->addition1status = $row['addition1status'];
        $this->addition1label = $row['addition1label'];
        $this->addition1type = $row['addition1type'];
        $this->addition1percentage = $row['addition1percentage'];
        $this->addition2status = $row['addition2status'];
        $this->addition2label = $row['addition2label'];
        $this->addition2type = $row['addition2type'];
        $this->addition2percentage = $row['addition2percentage'];
        $this->addition3status = $row['addition3status'];
        $this->addition3label = $row['addition3label'];
        $this->addition3type = $row['addition3type'];
        $this->addition3percentage = $row['addition3percentage'];
        $this->created = $row['created'];

    }
    function create(){

        // query to insert record
        $query = "INSERT INTO
                        " . $this->table_name . "
                    SET
                        user_id=:user_id,
                        currency=:currency,
                        deduction1status=:deduction1status,
                        deduction1label=:deduction1label,
                        deduction1type=:deduction1type,
                        deduction1percentage=:deduction1percentage,
                        deduction2status=:deduction2status,
                        deduction2label=:deduction2label,
                        deduction2type=:deduction2type,
                        deduction2percentage=:deduction2percentage,
                        addition1status=:addition1status,
                        addition1label=:addition1label,
                        addition1type=:addition1type,
                        addition1percentage=:addition1percentage,
                        addition2status=:addition2status,
                        addition2label=:addition2label,
                        addition2type=:addition2type,
                        addition2percentage=:addition2percentage,
                        addition3status=:addition3status,
                        addition3label=:addition3label,
                        addition3type=:addition3type,
                        addition3percentage=:addition3percentage";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->user_id=htmlspecialchars(strip_tags($this->user_id));
        $this->currency=htmlspecialchars(strip_tags($this->currency));
        $this->deduction1status=htmlspecialchars(strip_tags($this->deduction1status));
        $this->deduction1label=htmlspecialchars(strip_tags($this->deduction1label));
        $this->deduction1type=htmlspecialchars(strip_tags($this->deduction1type));
        $this->deduction1percentage=htmlspecialchars(strip_tags($this->deduction1percentage));
        $this->deduction2status=htmlspecialchars(strip_tags($this->deduction2status));
        $this->deduction2label=htmlspecialchars(strip_tags($this->deduction2label));
        $this->deduction2type=htmlspecialchars(strip_tags($this->deduction2type));
        $this->deduction2percentage=htmlspecialchars(strip_tags($this->deduction2percentage));
        $this->addition1status=htmlspecialchars(strip_tags($this->addition1status));
        $this->addition1label=htmlspecialchars(strip_tags($this->addition1label));
        $this->addition1type=htmlspecialchars(strip_tags($this->addition1type));
        $this->addition1percentage=htmlspecialchars(strip_tags($this->addition1percentage));
        $this->addition2status=htmlspecialchars(strip_tags($this->addition2status));
        $this->addition2label=htmlspecialchars(strip_tags($this->addition2label));
        $this->addition2type=htmlspecialchars(strip_tags($this->addition2type));
        $this->addition2percentage=htmlspecialchars(strip_tags($this->addition2percentage));
        $this->addition3status=htmlspecialchars(strip_tags($this->addition3status));
        $this->addition3label=htmlspecialchars(strip_tags($this->addition3label));
        $this->addition3type=htmlspecialchars(strip_tags($this->addition3type));
        $this->addition3percentage=htmlspecialchars(strip_tags($this->addition3percentage));

        // bind values
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":currency", $this->currency);
        $stmt->bindParam(":deduction1status", $this->deduction1status);
        $stmt->bindParam(":deduction1label", $this->deduction1label);
        $stmt->bindParam(":deduction1type", $this->deduction1type);
        $stmt->bindParam(":deduction1percentage", $this->deduction1percentage);
        $stmt->bindParam(":deduction2status", $this->deduction2status);
        $stmt->bindParam(":deduction2label", $this->deduction2label);
        $stmt->bindParam(":deduction2type", $this->deduction2type);
        $stmt->bindParam(":deduction2percentage", $this->deduction2percentage);
        $stmt->bindParam(":addition1status", $this->addition1status);
        $stmt->bindParam(":addition1label", $this->addition1label);
        $stmt->bindParam(":addition1type", $this->addition1type);
        $stmt->bindParam(":addition1percentage", $this->addition1percentage);
        $stmt->bindParam(":addition2status", $this->addition2status);
        $stmt->bindParam(":addition2label", $this->addition2label);
        $stmt->bindParam(":addition2type", $this->addition2type);
        $stmt->bindParam(":addition2percentage", $this->addition2percentage);
        $stmt->bindParam(":addition3status", $this->addition3status);
        $stmt->bindParam(":addition3label", $this->addition3label);
        $stmt->bindParam(":addition3type", $this->addition3type);
        $stmt->bindParam(":addition3percentage", $this->addition3percentage);

        // execute query
        if($stmt->execute()){
            return true;
        }
//        $errors = $stmt->errorInfo();
//        echo($errors[2]);
        return false;


    }
    function update(){

        // update query
        $query = "UPDATE " . $this->table_name . " SET
                        currency=:currency,
                        deduction1status=:deduction1status,
                        deduction1label=:deduction1label,
                        deduction1type=:deduction1type,
                        deduction1percentage=:deduction1percentage,
                        deduction2status=:deduction2status,
                        deduction2label=:deduction2label,
                        deduction2type=:deduction2type,
                        deduction2percentage=:deduction2percentage,
                        addition1status=:addition1status,
                        addition1label=:addition1label,
                        addition1type=:addition1type,
                        addition1percentage=:addition1percentage,
                        addition2status=:addition2status,
                        addition2label=:addition2label,
                        addition2type=:addition2type,
                        addition2percentage=:addition2percentage,
                        addition3status=:addition3status,
                        addition3label=:addition3label,
                        addition3type=:addition3type,
                        addition3percentage=:addition3percentage
                    WHERE
                        id=:id";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        $this->currency=htmlspecialchars(strip_tags($this->currency));
        $this->id=htmlspecialchars(strip_tags($this->id));
        $this->deduction1status=htmlspecialchars(strip_tags($this->deduction1status));
        $this->deduction1label=htmlspecialchars(strip_tags($this->deduction1label));
        $this->deduction1type=htmlspecialchars(strip_tags($this->deduction1type));
        $this->deduction1percentage=htmlspecialchars(strip_tags($this->deduction1percentage));
        $this->deduction2status=htmlspecialchars(strip_tags($this->deduction2status));
        $this->deduction2label=htmlspecialchars(strip_tags($this->deduction2label));
        $this->deduction2type=htmlspecialchars(strip_tags($this->deduction2type));
        $this->deduction2percentage=htmlspecialchars(strip_tags($this->deduction2percentage));
        $this->addition1status=htmlspecialchars(strip_tags($this->addition1status));
        $this->addition1label=htmlspecialchars(strip_tags($this->addition1label));
        $this->addition1type=htmlspecialchars(strip_tags($this->addition1type));
        $this->addition1percentage=htmlspecialchars(strip_tags($this->addition1percentage));
        $this->addition2status=htmlspecialchars(strip_tags($this->addition2status));
        $this->addition2label=htmlspecialchars(strip_tags($this->addition2label));
        $this->addition2type=htmlspecialchars(strip_tags($this->addition2type));
        $this->addition2percentage=htmlspecialchars(strip_tags($this->addition2percentage));
        $this->addition3status=htmlspecialchars(strip_tags($this->addition3status));
        $this->addition3label=htmlspecialchars(strip_tags($this->addition3label));
        $this->addition3type=htmlspecialchars(strip_tags($this->addition3type));
        $this->addition3percentage=htmlspecialchars(strip_tags($this->addition3percentage));


        // bind new values
        $stmt->bindParam(":currency", $this->currency);
        $stmt->bindParam(":deduction1status", $this->deduction1status);
        $stmt->bindParam(":deduction1label", $this->deduction1label);
        $stmt->bindParam(":deduction1type", $this->deduction1type);
        $stmt->bindParam(":deduction1percentage", $this->deduction1percentage);
        $stmt->bindParam(":deduction2status", $this->deduction2status);
        $stmt->bindParam(":deduction2label", $this->deduction2label);
        $stmt->bindParam(":deduction2type", $this->deduction2type);
        $stmt->bindParam(":deduction2percentage", $this->deduction2percentage);
        $stmt->bindParam(":addition1status", $this->addition1status);
        $stmt->bindParam(":addition1label", $this->addition1label);
        $stmt->bindParam(":addition1type", $this->addition1type);
        $stmt->bindParam(":addition1percentage", $this->addition1percentage);
        $stmt->bindParam(":addition2status", $this->addition2status);
        $stmt->bindParam(":addition2label", $this->addition2label);
        $stmt->bindParam(":addition2type", $this->addition2type);
        $stmt->bindParam(":addition2percentage", $this->addition2percentage);
        $stmt->bindParam(":addition3status", $this->addition3status);
        $stmt->bindParam(":addition3label", $this->addition3label);
        $stmt->bindParam(":addition3type", $this->addition3type);
        $stmt->bindParam(":addition3percentage", $this->addition3percentage);
        $stmt->bindParam(":id", $this->id);

        // execute the query
        if($stmt->execute()){
            return true;
        }
        $errors = $stmt->errorInfo();
        echo($errors[2]);
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
