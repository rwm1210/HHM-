<?php
    require_once('../../../tangramsconnect.php');
    
    //try goes here around this statement. Also, improve this so only shows within a
    $stmt = $hhmDb->query('SELECT * FROM shows ORDER BY date');
    
    // not a show array anymore, a %shows object where id is the key and the rest of the show is an object, value.
    
    $shows = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
        //$rowname = "show".$rowCount;
        //$puzzleInfo = array();
       // $puzzleInfo['id'] = $row['id'];
        
        //decode here so puzzle isn't encoded a second time below
        
      //  $puzzleInfo['puzzle'] = json_decode($row['puzzle']);
      //  $d[$rowname] = $puzzleInfo;
    // $rowCount++;
       // $row = htmlentities($row);
        
        /*
        foreach($row as $entry ){
            $entry = htmlentities($entry);
        }
        */
        $row['venue']= htmlentities($row['venue']);
        
        array_push($shows, $row);
    }
    $json = json_encode($shows);
    echo $json;

?>