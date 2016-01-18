<?php
    $lifetime = 600;
    $httponly = true;
    session_set_cookie_params($lifetime,$httponly);
    session_start();

    require_once('../../../tangramsconnect.php');

    $blacklist = "#[/<>\\\\@^&*\(\)\{\}\+\?\]\[]\ #";

    $username = $_POST['username'];
    $password = $_POST['password'];

    // if username
    // add login DB query username...for just 1 user name...

    $stmt = $hhmDb->prepare("SELECT * FROM login WHERE username = :username");
    $stmt->bindParam(':username',$username);
    try{
        $stmt->execute();
    }catch(PDOException $e)
    {
        echo(json_encode("incorrect username or password, not found in DB"));
        exit;
    }

    $account = $stmt->fetch(PDO::FETCH_ASSOC);
    $actualPassword = $account['password'];
    $failedAttempts = $account['failedAttempts'];
    $accountName = $account['username'];

    if($accountName == "")
    {
        echo(json_encode("incorrect username or password"));
        exit;
    }

    /* no account locking anymore
    if($failedAttempts > 20){
        echo(json_encode("account has been locked due to 20 consecutive failed attempts, admin has been notified"));
           mail("rwm1210@gmail.com","account locked",$username);
        exit;
    }


    // prepare the update statement
    $updateStmt = $hhmDb->prepare("UPDATE login SET failedAttempts = :failedAttempts WHERE username = :username");
    $updateStmt->bindParam(':username',$username);

     */


    if(password_verify($password, $actualPassword))
    {
        $_SESSION['AUTHENTICATED'] = TRUE;
        $_SESSION['LAST_ACTIVITY'] = time();
        $message = json_encode("login success!");
        $authenticated = $_SESSION['AUTHENTICATED'];
        //update failedAttempts counter, bind param, and UPDATE db

        /* For account locking
        $failedAttempts = 0;
        $updateStmt->bindParam(':failedAttempts',$failedAttempts);
        try{
            $updateStmt->execute();
        }catch(PDOException $e)
        {
            echo(json_encode("unexpected error, Ryan has been notified"));
            exit;

        }
        */

        echo($message);

    }else{

        echo(json_encode("incorrect login"));
        /* for account locking
        $failedAttempts = $failedAttempts+1;
        echo(json_encode("incorrect login. Account will be locked after 20 failed attempts current number of failed attempts:" . $failedAttempts));
        //update failedAttempts counter, bind param, and UPDATE db


        $updateStmt->bindParam(':failedAttempts',$failedAttempts);
        try{
            $updateStmt->execute();
        }catch(PDOException $e)
        {
            echo(json_encode("unexpected error, Ryan has been notified"));
            exit;
        }
         */
        session_unset();
        session_destroy();

    }
?>
