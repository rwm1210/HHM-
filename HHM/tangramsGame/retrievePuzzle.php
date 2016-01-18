<?php
    require_once('../../../tangramsconnect.php');
 
    $stmt = $db->query('SELECT * FROM tangramPuzzles');
    $d = array();
    $rowCount = 0;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC))
    {
        $rowname = "puzzle".$rowCount;
        $puzzleInfo = array();
        $puzzleInfo['id'] = $row['id'];
        
        //decode here so puzzle isn't encoded a second time below

        $puzzleInfo['puzzle'] = json_decode($row['puzzle']);
        $d[$rowname] = $puzzleInfo;
        
        $rowCount++;
    }
    $json = json_encode($d);
    echo $json;
    
   // $results = $stmt->fetch(PDO::FETCH_ASSOC);
    
  //  echo $results['puzzle'];
    
    
    // tell the client how many rows are coming... may not be necessary.. but
    //  $row_count = $stmt->rowCount();
    //echo $row_count.' rows selected';
    // Ok, here is what I am going to do.
    // I only want to retrieve all the puzzles with this function because it is the first call to retrieve the puzzles and the game doesn't know the indexes of the puzzles ahead of time. After the indexes are known, it would be simple to request a puzzle at an index, though pointless since it would have already been loaded.
    // So, here is what needs to happen:
    
    // I need to return an object that looks like this:
    // puzzles = {puzzles:[{id:num, puzzle:{piece0:{coord0{x:val,y:val}}, }}},{},{},...{}]}
    
?>
