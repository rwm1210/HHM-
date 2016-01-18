
function upcomingShows(){
    
    // moving the buttons within here, a more general solution would have me passing in the id of the div where the shows will go. That can be done some other time.
    
    // div id = shows
    // <button id = "addShowButton"> add shows </button>
    
    var admin = false;
    var showsHaveBeenDisplayed = false;
    var showJustAdded = false;
    var shows = null;
    var addOrEditShowsPageOpen = false;
    
    function addUpcomingShow(e) // used to add or edit shows. Mode is determined based on Show ID(absent or present) and is handled in submitShow.php.
    {
        
        if(e.preventDefault())
        {
            e.preventDefault();
        }
        var formElement = document.forms["addShowForm"];
        var request = new XMLHttpRequest();
        
        request.onreadystatechange = function()
        {
            if(request.readyState===4)
            {
                if(request.status==200)
                {
                    callback(request.responseText);
                }
            }
            function callback(data){
                console.log(data);
                
                var response = JSON.parse(data);
                if(response == "done"){
                    alert(response);
                    this.showShows()
                }
                if(response == "login required")
                {
                    alert("please first login");
                    authenticated = false;
                    showAdminLogin();
                }else if(response == "session expired"){
                    alert("please login again, for security reasons your session timed-out");
                    showAdminLogin();
                }else{
                    alert(response);
                }
            }
        }
        request.open("POST", "/HHM/tangramsGame/submitShow.php");
        request.send(new FormData(formElement));
        showJustAdded = true;
    }
    
    function deleteShows(e)
    {
        if(e.preventDefault())
        {
           e.preventDefault();
        }
        var IDshowToDelete = e.target.myParam;
        var request = new XMLHttpRequest();
        
        request.onreadystatechange = function()
        {
            if(request.readyState===4)
            {
                if(request.status==200)
                {
                    callback(request.responseText);
                }
            }
            function callback(data){
                var response = JSON.parse(data);
                if(response == "login required")
                {
                    alert("please first login");
                    authenticated = false;
                    showAdminLogin();
                }else if(response == "session expired"){
                    alert("please login again, for security reasons your session timed-out");
                    authenticated = false;
                    showAdminLogin();
                }else{
                    alert(response);
                    this.showShows();
                }
            }
        }
        request.open("POST", "/HHM/tangramsGame/deleteShow.php");
        request.send(IDshowToDelete);
    }
           
    function reqListener() {
        //console.log(this.responseText);
    }
    
    // gets shows from DB and stores them in shoes
    function retrieveShows()
    {
        var oReq = new XMLHttpRequest();
        oReq.onreadystatechange = function()
        {
            if(oReq.readyState ===4)
            {
                if(oReq.status===200)
                {
                   callback(oReq.responseText);
                }
            }
        };
        
        function callback(data){
            var retrievedShows = JSON.parse(data);
            displayShows(retrievedShows);
        }
        oReq.open("get", "/HHM/tangramsGame/retrieveShows.php",true);
        oReq.send();
    }
    
    function setShows(newShows){
        alert(newShows);
        shows = newShows;
    }
    
    this.showShows = function(authLevel)
    {
        admin = authLevel;
        clearPage();
        retrieveShows();
    }
    
    function displayShows(newShows)
    {
        shows = newShows;
        var div = document.getElementById("shows");
        var form = document.createElement("form");
        form.id = "deleteShows";
        form.method = "GET";
        div.appendChild(form);
        var table = document.createElement("table");
        table.setAttribute("id", "showsTable");
        div.appendChild(table);
        // add heading
        var thead = document.createElement("thead");
        thead.setAttribute("class","showsHeading");
        var headingRow = table.insertRow(0);
        headingRow.setAttribute("class","showsHeadingText");
        
        /*
         var checkboxHeading = document.createElement("th");
         checkboxHeading.innerHTML = "Select";
         */
        var dateHeading = document.createElement("th");
        dateHeading.innerHTML = "Date   ";
        var venueHeading = document.createElement("th");
        venueHeading.innerHTML = "Venue     ";
        var timeHeading = document.createElement("th");
        timeHeading.innerHTML = "Time";
        var detailsHeading = document.createElement("th");
        detailsHeading.innerHTML = "Details";
        
       /* if(admin == true)
        {// checkbox heading only visible if logged in as admin
        //headingRow.appendChild(checkboxHeading);
        }
        */
        headingRow.appendChild(dateHeading);
        headingRow.appendChild(venueHeading);
        headingRow.appendChild(timeHeading);
        headingRow.appendChild(detailsHeading);
        
        // add shows in the body
        for(var i =0; i<shows.length; i++)
        {
            var show = shows[i];
            
            var row1 = document.createElement("tr");
            var tbody = document.createElement("tbody");
            var row2 = document.createElement("tr");
            
            /* Since checkboxes can't be nested within tables, and tables are super convenient for layout, in order to have a "checkbox" feature next to each show listing, I need to use a different method. Gmail, for instance, makes each "checkbox" its own div, and swaps the styling to draw in the check or not. In the interest of time I'm not going to tackle this yet, but this is a reminder of where such a div would go.
             
            if(admin == true){ // add the checkbox
                var checkboxCell = document.createElement("td");
                var checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.value = show['id'];
                checkbox.form = "deleteShows";
                checkbox.name = "delete[]";
                checkboxCell.appendChild(checkbox);
                row1.appendChild(checkboxCell);
            }
             */
            
            // add date
            var cellDate = document.createElement("td");
            var date = show["date"];
            date = date.replace('2015-','');
            cellDate.innerHTML = date;
            row1.appendChild(cellDate);
            
            // add venue. Ff venue link is present, make the name a link, else just display the name
            var cellVenue = document.createElement("td");
            if(show["venueLink"]!= null)
            {
                cellVenue.innerHTML = "<a class ="+"showVenueLink"+" href = "+show["venueLink"] +" target = \"_blank\" >" +show["venue"] + "</a>";
            }
            else{
                cellVenue.innerHTML = show["venue"];
            }
            row1.appendChild(cellVenue);
            
            // add time
            var cellTime = document.createElement("td");
            var time = (show["time"]);
            time = convertTo12Hour(time);
            cellTime.innerHTML= time;
            row1.appendChild(cellTime);
            
            // details toggle button
            var moreButtonCell = document.createElement("td");
            var morebutton = document.createElement("p");
            morebutton.innerHTML = "more";
            morebutton.addEventListener("click",toggleShowInfo,false);
            morebutton.myParam = {row:row2,more:morebutton};
            moreButtonCell.appendChild(morebutton);
            row1.appendChild(moreButtonCell);
            table.appendChild(row1);
            
            // details row
            row2.style.display = "none";
            //var detailsContainer = document.createElement("div");
            
            
            
            var allDetails = document.createElement("td");
            allDetails.setAttribute("class","detailsContainer");
            
            var colspan = 4;
            //var checkboxplaceholder = document.createElement("td");
            
            //row2.appendChild(checkboxplaceholder);
           
            allDetails.setAttribute("colspan", colspan);
            
            //address
            if(show["address"] != null){
                var address = document.createElement("p");
                address.innerHTML = "Address: "+ show["address"];
                allDetails.appendChild(address);
            }
            //venue phone
            if(show["venuePhone"] != null){
                var phone = document.createElement("p");
                phone.innerHTML = "Phone: "+ show["venuePhone"];
                allDetails.appendChild(phone);
            }
            //map link
            if(show["mapUrl"] != null){
                var map = document.createElement("p");
                map.innerHTML = "<a class = showVenueLink href ="+show["mapUrl"] +" target = \"_blank\" > Map </a>";
                allDetails.appendChild(map);
            }
            //purchase tickets link
            if(show["ticketLink"] != null){
                var ticketLink = document.createElement("p");
                ticketLink.innerHTML = "<a class = showVenueLink href ="+show["ticketLink"] +" target = \"_blank\" > Buy Tickets Here </a>";
                allDetails.appendChild(ticketLink);
            }
            //ages
            if(show["ageRestrictions"]!= null){
                var age = document.createElement("p");
                age.innerHTML = "Age: "+ show["ageRestrictions"];
                allDetails.appendChild(age);
            }
            //price
            if(show["admission"]!=null)
            {
                var price = document.createElement("p");
                price.innerHTML = "Price: "+ show["admission"];
                allDetails.appendChild(price);
            }
            //comments
            if(show["comments"]!=null)
            {
                var comments = document.createElement("p");
                comments.innerHTML = show["comments"];
                allDetails.appendChild(comments);
                
            }
           
            // edit details button
            if(admin == true){
                var editButton = document.createElement("button");
                editButton.innerHTML = "Edit Show Details";
                editButton.addEventListener("click",addOrEditShow, false);
                editButton.myParam = {id:show["id"], mode:"edit"};
                allDetails.appendChild(editButton);
            }
            
            table.appendChild(row1);
            row2.appendChild(allDetails);
            table.appendChild(row2);
        }
     
        if(admin == true)
        {
            // add show button
            var addShow = document.createElement("button");
            addShow.innerHTML = "Add Show";
            addShow.addEventListener("click", addOrEditShow, false);
            addShow.myParam = {mode:"add"};
            div.appendChild(addShow);
            
            /* deleteShowButton This won't be needed until I address the checkbox workaround noted above
             
            var deleteShow = document.createElement("button");
            deleteShow.innerHTML = "Delete show(s)";
            deleteShow.addEventListener("click", deleteShows, false);
            // this parameter needs to be all of the shows checked,
            deleteShow.myParam = show["id"];
            div.appendChild(deleteShow);
             */
        }
        
        function toggleShowInfo(evt){
            
            var row = evt.target.myParam.row;
            var morebutton = evt.target.myParam.more;
            if(row.style.display == "none"){
                row.style.display = "table-row";
                morebutton.innerHTML = "less"
            }else if(row.style.display =="table-row"){
                row.style.display = "none"
                morebutton.innerHTML = "more";
            }
        }
        
        function addOrEditShow(evt) // render HTML form, fill out values for fields if present, save show.
        {
            clearPage();
            addOrEditShowsPageOpen = true;
            var date = "";
            var time = "";
            var city = "";
            var venue = "";
            var venueLink = "";
            var venuePhone = "";
            var mapLink = "";
            var ticketLink = "";
            var address = "";
            var price = "";
            var ages = "";
            var comments = "";
            
            var id;
            var mode = evt.target.myParam.mode;
            
            var div = document.getElementById("shows");
            if(mode === "edit"){id = evt.target.myParam.id};
            var form  = document.createElement("form");
                
            form.setAttribute("class","addShowsInput");
            form.setAttribute("class","showsHeadingText");
            form.name = "addShowForm";
            form.id = "addShowForm";
            
            div.appendChild(form);
            
            var show;
            
            if(mode === "edit"){
                for(var i = 0; i<shows.length; i++)
                {
                    if( shows[i]["id"] == id)
                    {
                        //console.log("show found");
                        show = shows[i];

                        date = show["date"];
                        time = show["time"];
                        city = show["city"];
                        venue = show["venue"];
                        console.log(show["ageRestrictions"]);
                        if(show["venueLink"]){ venueLink = show["venueLink"];}
                        if(show["venuePhone"]!=null){ venuePhone = show["venuePhone"];}
                        if(show["mapLink"]!= null) { mapLink = show["mapLink"];}
                        if(show["ticketLink"]!=null){ ticketLink = show["ticketLink"];}
                        if(show["address"]!=null){address = show["address"];}
                        if(show["admission"]!=null){price = show["admission"];}
                        if(show["comments"]!=null){comments = show["comments"];}
                        if(show["ageRestrictions"]!=null){ages = show["ageRestrictions"];}
                        //comments = show["comments"];
                    }
                }
            }
            
            //add date field
            var dateInput = document.createElement("input");
            var dateName = document.createElement("p");
            dateName.innerHTML = "\<br\>  Date: ";
            dateName.style.display = "inline";
            dateInput.type = "date";
            dateInput.name = "date";
            dateInput.value= date;
            form.appendChild(dateName);
            form.appendChild(dateInput);
            
            //add time field
            var timeInput = document.createElement("input");
            var timeName = document.createElement("p");
            timeName.innerHTML =  "\<br\>  Time: ";
            timeName.style.display = "inline";
            timeInput.type = "time";
            timeInput.name = "time";
            timeInput.value = time;
            form.appendChild(timeName);
            form.appendChild(timeInput);
            
            
            //add city field
            var cityInput = document.createElement("input");
            var cityName = document.createElement("p");
            cityName.innerHTML = " \<br\> City: ";
            cityName.style.display = "inline";
            cityInput.type = "text";
            cityInput.name = "city";
            cityInput.value = city;
            form.appendChild(cityName);
            form.appendChild(cityInput);
            
            //add venue field
            var venueInput = document.createElement("input");
            var venueName = document.createElement("p");
            venueName.innerHTML = " \<br\> Venue: ";
            venueName.style.display = "inline";
            venueInput.type = "text";
            venueInput.name = "venue";
            venueInput.value = venue;
            form.appendChild(venueName);
            form.appendChild(venueInput);
            
            //add venue link
            var venueLinkInput = document.createElement("input");
            var venueLinkName = document.createElement("p");
            venueLinkName.innerHTML = " \<br\> Venue link: ";
            venueLinkName.style.display = "inline";
            venueLinkInput.type = "url";
            venueLinkInput.name = "venueLink";
            venueLinkInput.value = venueLink;
            form.appendChild(venueLinkName);
            form.appendChild(venueLinkInput);
            
            //add venue phone
            var venuePhoneInput = document.createElement("input");
            var venuePhoneName = document.createElement("p");
            venuePhoneName.innerHTML = " \<br\> Venue Phone: ";
            venuePhoneName.style.display = "inline";
            venuePhoneInput.type = "tel";
            venuePhoneInput.name = "venuePhone";
            venuePhoneInput.value = venuePhone;
            form.appendChild(venuePhoneName);
            form.appendChild(venuePhoneInput);
            
            //add map link
            var mapLinkInput = document.createElement("input");
            var mapLinkName = document.createElement("p");
            mapLinkName.innerHTML = " \<br\> Map Link: ";
            mapLinkName.style.display = "inline";
            mapLinkInput.type = "url";
            mapLinkInput.name = "mapUrl";
            mapLinkInput.value = mapLink;
            form.appendChild(mapLinkName);
            form.appendChild(mapLinkInput);
            
            //add address input
            var addressInput = document.createElement("input");
            var addressName = document.createElement("p");
            addressName.innerHTML = " \<br\> Address: ";
            addressName.style.display = "inline";
            addressInput.type = "text";
            addressInput.name = "address";
            addressInput.value = address;
            form.appendChild(addressName);
            form.appendChild(addressInput);
            
            //add tickets link
            var ticketLinkInput = document.createElement("input");
            var ticketLinkName = document.createElement("p");
            ticketLinkName.innerHTML = " \<br\> Ticket Link: ";
            ticketLinkName.style.display = "inline";
            ticketLinkInput.type = "url";
            ticketLinkInput.name = "ticketLink";
            ticketLinkInput.value = ticketLink;
            form.appendChild(ticketLinkName);
            form.appendChild(ticketLinkInput);
            
            //add price
            var priceInput = document.createElement("input");
            var priceName = document.createElement("p");
            priceName.innerHTML = " \<br\> Price: ";
            priceName.style.display = "inline";
            priceInput.type = "text";
            priceInput.name = "price";
            priceInput.value = price;
            form.appendChild(priceName);
            form.appendChild(priceInput);
            
            //add ages
            var ageInput = document.createElement("input");
            var ageName = document.createElement("p");
            ageName.innerHTML = " \<br\> Age: ";
            ageName.style.display = "inline";
            ageInput.type = "text";
            ageInput.name = "ages";
            ageInput.value = ages;
            form.appendChild(ageName);
            form.appendChild(ageInput);
            
            //add comments
            var commentsInput = document.createElement("input");
            var commentsName = document.createElement("p");
            commentsName.innerHTML = " \<br\> Comments: ";
            commentsName.style.display = "inline";
            commentsInput.type = "text";
            commentsInput.name = "comments";
            commentsInput.value = comments;
            form.appendChild(commentsName);
            form.appendChild(commentsInput);
            
            //add ID
            
            if(mode == "edit"){
                var iDInput = document.createElement("input");
                iDInput.type = "hidden";
                iDInput.name = "id";
                iDInput.value = show["id"];
                form.appendChild(iDInput);
            }
            //submit button
            var showSubmitButton = document.createElement("input");
            showSubmitButton.value = "save changes";
            showSubmitButton.type = "submit";
            showSubmitButton.style.display = "block";
            showSubmitButton.addEventListener("click",addUpcomingShow,false)
            form.appendChild(showSubmitButton);
            
            //delete button
            if(mode == "edit"){
            var deleteShow = document.createElement("input");
            deleteShow.type = "submit";
            deleteShow.value = "Delete Show";
            deleteShow.addEventListener("click", deleteShows, false);
            deleteShow.myParam = show["id"];
            div.appendChild(deleteShow);
            }
        }
        /* iterate through shows, and insert their values into a table row and insert into the dom at
         showsTable
         */
    }
    
    function clearPage()
    {
        var div = document.getElementById("shows");
        while(div.hasChildNodes())
        {
            div.removeChild(div.childNodes[0]);
        }
    }
    
    
    function convertTo12Hour(time)
    {
        var convertedTime = "";
        var hour = Number(time.substring(0,2));
        var minute = time.substring(3,5);
        var ampm;
        if(hour < 13){
            ampm = "AM";
        }else if(hour < 24){
            ampm = "PM";
        }else if(hour == 24){
            ampm = "AM";
        }
        hour = (hour > 12 ? hour -=12 : hour);
        convertedTime = hour.toString() + ":" + minute +" "+ ampm;
        return convertedTime;
    }
    
    function validateForm()
    {
        return false;
    }
}