<?
    require_once('../../../tangramsconnect.php');
    $username = $_POST['username'];
    $password = $_POST['password'];

    $password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $hhmDb->prepare("INSERT INTO login (username,password) VALUES (:username,:password)");
    $stmt->bindParam(':username',$username);
    $stmt->bindParam(':password', $password);

    try{
        $stmt->execute();
        echo(json_encode("done"));
    }catch(PDOException $e){
        echo(json_encode("changes not saved" . $e->getMessage()));
        exit;
    }    
?>
