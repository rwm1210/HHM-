<?php
    // retrive file, check if it has the correct file extension, and isn't too big, and only allow
    // some number of songs in the directory.
    
    $dir = '/Library/WebServer/Documents/HHM/tangramsGame/songs';
    $songs = scandir($dir); // this will capture [0]=., [1]=..
    echo (json_encode($songs));
    
    ?>