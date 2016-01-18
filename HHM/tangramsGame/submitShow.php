<?php
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
        
    }else
    {
        // The form data is checked only to see if it contains potentially malicious code.
        // It's up to the user (me) if he/she wants to make up rediculous city names, prices,
        // age restrictions, etc.
        
        $blacklist = "#[/<>\\\\@^&*\(\)\{\}\]\[]#";
        //venue, mandatory

        $unverifiedVenue = ($_POST['venue']);
        /*
        $unverifiedVenue = preg_replace("/&/", "&amp;", $unverifiedVenue);
        $unverifiedVenue = preg_replace("/</", "&lt;", $unverifiedVenue);
        $unverifiedVenue = preg_replace("/>/", "&gt;", $unverifiedVenue);
        */
        $venue = mysql_real_escape_string($unverifiedVenue);

        /*
        if(strlen($unverifiedVenue) == 0){
            echo(json_encode("please add a venue"));
            exit;
        }else if(preg_match($blacklist,$unverifiedVenue)){
            echo(json_encode("Venue name can only contain letters, numbers, underscores, spaces and apostrophes"));
            exit;
        }else{
            $venue = $unverifiedVenue;
        }
         */
        
        //date, mandatory
        $unverifiedDate = $_POST['date'];
        if(preg_match($blacklist,$unverifiedDate)){
           echo(json_encode("please format your date yyyy-mm-dd, using Chrome will give you a handy date selector widet"));
            exit;
        }else{
            $date = $unverifiedDate;
        }
        
        //time, mandatory
        $unverifiedTime = $_POST['time'];
        if(preg_match($blacklist,$unverifiedTime)){
            echo(json_encode("Sorry, invalid. Time must be HH:MM (24hr)"));
            exit;
        }else{
            $time = $unverifiedTime;
        }

        //city, mandatory
        $unverifiedCity = $_POST['city'];
        if(preg_match($blacklist, $unverifiedCity)){
            echo(json_encode("City name can only contain letters, numbers, and spaces"));
            exit;
        }else{
            $city = $unverifiedCity;
        }
        
        
        //venue link, optional
        $unverifiedVenueLink = $_POST['venueLink'];
        if(strlen($unverifiedVenueLink)>0){
            if(filter_var($unverifiedVenueLink, FILTER_VALIDATE_URL)){
               $venueLink = $unverifiedVenueLink;
            }else{
                echo(json_encode("If you are adding a venue link please make sure it is a complete URL to the venue homepage (just copy+paste it)"));
                exit;
            }
        }
        
        //map url, optional
        $unverifiedMapUrl = $_POST['mapLink'];
        if(strlen($unverifiedMapUrl)>0){
            if(filter_var($unverifiedVenueLink, FILTER_VALIDATE_URL)){
                $mapUrl = $unverifiedMapUrl;
            }else{
                echo(json_encode("If you are adding a map link please make sure it is a complete URL to the venue homepage (just copy & paste it)"));
                exit;
            }
        }
        
        //tickets link, optional
        $unverifiedTicketsLink = $_POST['ticketsLink'];
        if(strlen($unverifiedTicketsLink)>0){
            if(filter_var($unverifiedTicketsLink, FILTER_VALIDATE_URL)){
                $ticketsLink = $unverifiedTicketsLink;
            }else{
                echo(json_encode("If you are adding a tickets link please make sure it is a complete URL to the venue homepage (just copy & paste it)"));
                exit;
            }
        }
        
        //admission, optional
        $unverifiedAdmission = $_POST['price'];
        if(strlen($unverifiedAdmission)>0){
            if(preg_match($blacklist, $unverifiedAdmission)){
                echo(json_encode("price is simply a number, the dollar sign is optional"));
                exit;
            }else{
                $admission = $unverifiedAdmission;
            }
        }
        
        //ageRestriction, optional
        $unverifiedAgeRestriction = $_POST['ages'];
        if(strlen($unverifiedAgeRestriction)>0){
            if(preg_match($blacklist, $unverifiedAgeRestriction))
            {
                echo(json_encode("you can only enter a 1 or 2 digit number and an optional plus sign here"));
                exit;
            }else{
                $ageRestriction = $unverifiedAgeRestriction;
            }
        }
        
        //address, optional
        $unverifiedAddress = $_POST['address'];
        if(strlen($unverifiedAddress)>0){
            if(preg_match($blacklist,$unverifiedAddress))
            {
                echo(json_encode("Address can only contain letters, numbers, and spaces"));
                exit;
                
            }else{
                $address = $unverifiedAddress;
            }
        }
        
        //phone number, optional
        $unverifiedVenuePhone = $_POST['venuePhone'];
        if(strlen($unverifiedVenuePhone)>0)
        {
            if(preg_match($blacklist,$unverifiedVenuePhone)){
                echo(json_encode("please check your number and try again"));
                exit;
            }else{
                $venuePhone = $unverifiedVenuePhone;
            }
        }
        
        //comments, optional
        $unverifiedComments = $_POST['comments'];
        if(strlen($unverifiedComments)>0)
        {
            if(preg_match($blacklist, $unverifiedComments))
            {
                echo(json_encode("Comments can only contain letters, numbers, spaces,and some punctuation(comma, period, hypen, apostrophe"));
                exit;
            }else{
                $comments = $unverifiedComments;
            }
        }
        $id = NULL;
       
        if($_POST['id']!= null){
            $id = $_POST['id'];
        
            $stmt = $hhmDb->prepare("UPDATE shows SET venue=:venue,date=:date,city=:city,venueLink=:venueLink,mapUrl=:mapUrl,ticketsLink=:ticketsLink,time=:time,admission=:admission,ageRestrictions=:ageRestriction,address=:address,venuePhone=:venuePhone,comments=:comments WHERE id = :id");
            $stmt->bindParam(':id',$id);
                                    
        }else{
       
        $stmt = $hhmDb->prepare("INSERT INTO shows (venue,date,city,venueLink,mapUrl,ticketsLink,time,admission,ageRestrictions,address,venuePhone,comments) VALUES(:venue,:date,:city,:venueLink,:mapUrl,:ticketsLink,:time,:admission,:ageRestriction,:address,:venuePhone,:comments)");
        }
        $stmt->bindParam(':venue',$venue);
        $stmt->bindParam(':date', $date);
        $stmt->bindParam(':city', $city);
        $stmt->bindParam(':venueLink', $venueLink);
        $stmt->bindParam(':mapUrl', $mapUrl);
        $stmt->bindParam(':ticketsLink', $ticketsLink);
        $stmt->bindParam(':time', $time);
        $stmt->bindParam(':admission', $admission);
        $stmt->bindParam(':ageRestriction', $ageRestriction);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':venuePhone', $venuePhone);
        $stmt->bindParam(':comments', $comments);
        
        try{
            $stmt->execute();
            echo(json_encode("done"));
        }catch(PDOException $e){
            echo(json_encode("changes not saved" . $e->getMessage()));
            exit;
        }
        
    }
    
?>