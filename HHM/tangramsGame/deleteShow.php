<?php
    /* deleteShow.php */
    $lifetime = 600;
    $httponly = true;
    session_set_cookie_params($lifetime,$httponly);
    session_start();
    
    require_once('../../../tangramsconnect.php');
    
    
    if(isset($_SESSION['AUTHENTICATED']) && $_SESSION['AUTHENTICATED'] == FALSE){
        $invalidSession = json_encode("login required");
        echo($invalidSession);
        
    }elseif(isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > 600)) {
        // last request was more than 30 seconds ago
        $_SESSION['AUTHENTICATED'] = FALSE;
        $invalidSession = json_encode("session expired");
        echo($invalidSession);
        
    }else{
    
        try{
            $showsToBeDeleted = file_get_contents("php://input");
            echo(json_encode($showsToBeDeleted));
            $stmt = $hhmDb->prepare("DELETE FROM shows WHERE id=:id");
            $stmt->bindValue(':id', $showsToBeDeleted, PDO::PARAM_STR);
            $stmt->execute();
            echo(json_encode("show deleted"));
        }catch(PDOException $e)
        {
            echo(json_encode("show not added" . $e->getMessage()));
            exit;
        }
        
    }

?>