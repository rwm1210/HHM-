<?php
    /* storePuzzle.php */
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

        $puzzleSolution = file_get_contents("php://input");
        
        //$puzzleSolution = json_decode($puzzleSolution);
        $blacklist = $blacklist = "#[/<>\\\\@!^&*\(\)\{\}\+\?\]\[a-z]#i";
        $puzzleSolution = json_decode($puzzleSolution);
        
        // Verify puzzle contains only numbers. If it doesn't notify me with the puzzle contents in an email.
        foreach($puzzleSolution as $pieces)
        {
            foreach($pieces as $coordinate)
            {
                if($coordinate->x != NULL && $coordinate->y != NULL)
                {
                    if(preg_match($blacklist, $coordinate->x) || preg_match($blacklist, $coordinate->y))
                    {
                        echo(json_encode("malformed puzzle, admin has been notified"));
                        mail("rwm1210@gmail.com","Malformed puzzle submission attempt",json_encode($puzzleSolution));
                        exit;
                    }
                }
            }
        }
       
        $puzzleSolution = json_encode($puzzleSolution);
        $stmt = $db->prepare("INSERT INTO tangramPuzzles(puzzle) VALUES(:puzzleSolution)");
        try{
            $stmt-> execute(array(':puzzleSolution' =>$puzzleSolution));
            echo(json_encode("puzzle added"));
        }catch(PDOException $e){
            echo(json_encode("puzzle not added"));
            mail("rwm1210@gmail.com","Couldn't access database for puzzle submission",$e->getMessage());
            exit;
        }
    
       $affectedrows = $stmt->rowCount();
     
    }
?>

