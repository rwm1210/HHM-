<?php

    require_once('../../../tangramsconnect.php');
    
    $puzzleId = file_get_contents("php://input");
    //$puzzleId = 29;
    echo("delete puzzle php");
    $stmt = $db->prepare("DELETE FROM tangramPuzzles WHERE id=:id");
    $stmt->bindValue(':id', $puzzleId, PDO::PARAM_STR);
    $stmt->execute();
    $affected_rows = $stmt->rowCount();
    echo $affected_rows;
    
?>