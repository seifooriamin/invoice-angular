<?php
    // 'user' object
    class Users{

        // database connection and table name
        private $conn;
        private $table_name = "users";

        // object properties
        public $id;
        public $first_name;
        public $last_name;
        public $email;
        public $password;
        public $contact_number;
        public $address1;
        public $address2;
        public $city;
        public $province;
        public $country;
        public $postal_code;
        public $access_level;
        public $access_code;
        public $status;
        public $created;
        public $modified;


        // constructor
        public function __construct($db){
            $this->conn = $db;
        }

        function emailExists(){

            // query to check if email exists
            $query = "SELECT id, first_name, last_name, access_level, password, status, access_code
                FROM " . $this->table_name . "
                WHERE email = ?
                LIMIT 0,1";

            // prepare the query
            $stmt = $this->conn->prepare( $query );

            // sanitize
            $this->email=htmlspecialchars(strip_tags($this->email));

            // bind given email value
            $stmt->bindParam(1, $this->email);

            // execute the query
            $stmt->execute();

            // get number of rows
            $num = $stmt->rowCount();

            // if email exists, assign values to object properties for easy access and use for php sessions
            if($num>0){

                // get record details / values
                $row = $stmt->fetch(PDO::FETCH_ASSOC);

                // assign values to object properties
                $this->id = $row['id'];
                $this->first_name = $row['first_name'];
                $this->last_name = $row['last_name'];
                $this->access_level = $row['access_level'];
                $this->access_code = $row['access_code'];
                $this->password = $row['password'];
                $this->status = $row['status'];

                // return true because email exists in the database
                return true;
            }

            // return false if email does not exist in the database
            return false;
        }

        function emailValidated(){

            // query to check if email exists
            $query = "SELECT id, status
                FROM " . $this->table_name . "
                WHERE email = ? && status = 1
                LIMIT 0,1";

            // prepare the query
            $stmt = $this->conn->prepare( $query );

            // sanitize
            $this->email=htmlspecialchars(strip_tags($this->email));

            // bind given email value
            $stmt->bindParam(1, $this->email);

            // execute the query
            $stmt->execute();

            // get number of rows
            $num = $stmt->rowCount();

            // if email exists, assign values to object properties for easy access and use for php sessions
            if($num>0){

                // return true because email exists in the database
                return true;
            }

            // return false if email does not exist in the database
            return false;
        }

        // create new user record
        function create(){


            // insert query
            $query = "INSERT INTO " . $this->table_name . "
                SET
            first_name = :first_name,
            last_name = :last_name,
            email = :email,
            contact_number = :contact_number,
            address1 = :address1,
            address2 = :address2,
            city = :city,
            province = :province,
            country = :country,
            postal_code = :postal_code,
            password = :password,
            access_level = :access_level,
            access_code = :access_code,
            status = :status";

            // prepare the query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->first_name=htmlspecialchars(strip_tags($this->first_name));
            $this->last_name=htmlspecialchars(strip_tags($this->last_name));
            $this->email=htmlspecialchars(strip_tags($this->email));
            $this->contact_number=htmlspecialchars(strip_tags($this->contact_number));
            $this->address1=htmlspecialchars(strip_tags($this->address1));
            $this->address2=htmlspecialchars(strip_tags($this->address2));
            $this->city=htmlspecialchars(strip_tags($this->city));
            $this->province=htmlspecialchars(strip_tags($this->province));
            $this->country=htmlspecialchars(strip_tags($this->country));
            $this->address1=htmlspecialchars(strip_tags($this->address1));
            $this->password=htmlspecialchars(strip_tags($this->password));
            $this->access_level=htmlspecialchars(strip_tags($this->access_level));
            $this->access_code=htmlspecialchars(strip_tags($this->access_code));
            $this->status=htmlspecialchars(strip_tags($this->status));

            // bind the values
            $stmt->bindParam(':first_name', $this->first_name);
            $stmt->bindParam(':last_name', $this->last_name);
            $stmt->bindParam(':email', $this->email);
            $stmt->bindParam(':contact_number', $this->contact_number);
            $stmt->bindParam(':address1', $this->address1);
            $stmt->bindParam(':address2', $this->address2);
            $stmt->bindParam(':city', $this->city);
            $stmt->bindParam(':province', $this->province);
            $stmt->bindParam(':country', $this->country);
            $stmt->bindParam(':postal_code', $this->postal_code);

            // hash the password before saving to database
            $password_hash = password_hash($this->password, PASSWORD_BCRYPT);
            $stmt->bindParam(':password', $password_hash);

            $access_level_hash = $password_hash($this->access_level, PASSWORD_BCRYPT);
            $stmt->bindParam(':access_level', $access_level_hash);
            $stmt->bindParam(':access_code', $this->access_code);
            $stmt->bindParam(':status', $this->status);

            // execute the query, also check if query was successful
            if($stmt->execute()){
                return true;
            }else{
                $this->showError($stmt);
                return false;
            }

        }

        public function showError($stmt){
            echo "<pre>";
            print_r($stmt->errorInfo());
            echo "</pre>";
        }

        // read all user records
        function readAll($from_record_num, $records_per_page){

            // query to read all user records, with limit clause for pagination
            $query = "SELECT
                    id,
                    firstname,
                    lastname,
                    email,
                    contact_number,
                    access_level,
                    created
                FROM " . $this->table_name . "
                ORDER BY id DESC
                LIMIT ?, ?";

            // prepare query statement
            $stmt = $this->conn->prepare( $query );

            // bind limit clause variables
            $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
            $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);

            // execute query
            $stmt->execute();

            // return values
            return $stmt;
        }

        // used for paging users
        public function countAll(){

            // query to select all user records
            $query = "SELECT id FROM " . $this->table_name . "";

            // prepare query statement
            $stmt = $this->conn->prepare($query);

            // execute query
            $stmt->execute();

            // get number of rows
            $num = $stmt->rowCount();

            // return row count
            return $num;
        }

        // used in email verification feature
        function updateStatusByAccessCode(){

            // update query
            $query = "UPDATE " . $this->table_name . "
                SET status = :status
                WHERE access_code = :access_code";

            // prepare the query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->status=htmlspecialchars(strip_tags($this->status));
            $this->access_code=htmlspecialchars(strip_tags($this->access_code));

            // bind the values from the form
            $stmt->bindParam(':status', $this->status);
            $stmt->bindParam(':access_code', $this->access_code);

            // execute the query
            if($stmt->execute()){
                return true;
            }

            return false;
        }

        // check if given access_code exist in the database
        function accessCodeExists(){

            // query to check if access_code exists
            $query = "SELECT id
                FROM " . $this->table_name . "
                WHERE access_code = ?
                LIMIT 0,1";

            // prepare the query
            $stmt = $this->conn->prepare( $query );

            // sanitize
            $this->access_code=htmlspecialchars(strip_tags($this->access_code));

            // bind given access_code value
            $stmt->bindParam(1, $this->access_code);

            // execute the query
            $stmt->execute();

            // get number of rows
            $num = $stmt->rowCount();

            // if access_code exists
            if($num>0){

                // return true because access_code exists in the database
                return true;
            }

            // return false if access_code does not exist in the database
            return false;

        }
        // used in forgot password feature
        function updateAccessCode(){

            // update query
            $query = "UPDATE
                    " . $this->table_name . "
                SET
                    access_code = :access_code
                WHERE
                    email = :email";

            // prepare the query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->access_code=htmlspecialchars(strip_tags($this->access_code));
            $this->email=htmlspecialchars(strip_tags($this->email));

            // bind the values from the form
            $stmt->bindParam(':access_code', $this->access_code);
            $stmt->bindParam(':email', $this->email);

            // execute the query
            if($stmt->execute()){
                return true;
            }

            return false;
        }
        // used in forgot password feature
        function updatePassword(){

            // update query
            $query = "UPDATE " . $this->table_name . "
                SET password = :password
                WHERE access_code = :access_code";

            // prepare the query
            $stmt = $this->conn->prepare($query);

            // sanitize
            $this->password=htmlspecialchars(strip_tags($this->password));
            $this->access_code=htmlspecialchars(strip_tags($this->access_code));

            // bind the values from the form
            $password_hash = password_hash($this->password, PASSWORD_BCRYPT);
            $stmt->bindParam(':password', $password_hash);
            $stmt->bindParam(':access_code', $this->access_code);

            // execute the query
            if($stmt->execute()){
                return true;
            }

            return false;
        }


    }
?>
