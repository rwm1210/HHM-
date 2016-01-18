
/************* Mouse Event Hanlders ******************/
/*
 event codes:   0 = mouseclick or touch start,
 1 = mousemove or touch move ,
 2 = mouse up or touch end or touch cancel
 */


function initEvents(newGameBoard)
{
    var el = document.getElementsByTagName("canvas")[0];
    game = newGameBoard;
  
    
   
    
    // Tangrams game events
    el.addEventListener("touchstart", handleStart, false);
    el.addEventListener("touchend", handleEnd, false);
    el.addEventListener("touchcancel", handleCancel, false);
    el.addEventListener("touchleave", handleEnd, false);
    el.addEventListener("touchmove", handleMove, false);
    el.addEventListener("mousemove", handleMousemove,false);
    el.addEventListener("mousedown", handleMousedown,false);
    el.addEventListener("mouseup", handleMouseup,false);
    

   
    var storeButton = document.getElementById("generatePuzzle");
    var retrieveButton = document.getElementById("retrievePuzzle");
    var nextButton = document.getElementById("nextPuzzle");
    var deleteButton = document.getElementById("deletePuzzle");
    
    //storeButton.addEventListener("click", storePuzzle,false);
    //nextButton.addEventListener("click", nextPuzzle, false);
    //deleteButton.addEventListener("click", deletePuzzle, false);
    
    // main menu of homepage
    var menuButton = document.getElementById("logo");
    menuButton.addEventListener("click", showMenu, false);
    
    // main menu items
    var booking = document.getElementById("menuBooking");
    booking.addEventListener("click", showBooking, false);
    
    var menuItemPlay = document.getElementById("menuPlay");
    menuItemPlay.addEventListener("click", tangramsMenu, false);
    
    var show = document.getElementById("menuShows");
    show.addEventListener("click", showShows, false);
    
    var press = document.getElementById("menuPress");
    press.addEventListener("click", showPress, false);
    
    var band = document.getElementById("menuBand");
    band.addEventListener("click", showTheBand, false);
    // Upcoming shows page
    
    // for starting the game
    var playButton = document.getElementById("playbutton");
    playButton.addEventListener("click",play, false);
    

    var adminLoginSubmit = document.getElementById("adminLoginSubmitButton");
    adminLoginSubmit.addEventListener("click",submitAdminCredentials,false);
    
 
    
    //retrieveButton.addEventListener("click", retrievePuzzle);
    //window.addEventListener("resize", resizeGame, false);
    //window.addEventListener("orientationchange", resizeGameHandler, false);

    //audio.play();
    // console.log("initialized.");

    var eventInProgress = false;
    var game;
    var cursor = new coordinate(0,0);
    var clickOrDrag = 0;
    //var screenScale = 1;
    
    
    function handleMousedown(evt)
    {
        evt.preventDefault();
        clickOrDrag = 0;
        if(!eventInProgress)
        {
            eventInProgress = true;
            game.updateBoard(0,clickOrDrag,cursor);
            eventInProgress = false;
        }
    }
    
    function handleMouseup(evt)
    {
        //console.log("click or drag = "+ clickOrDrag);
        if(!eventInProgress)
        {
            eventInProgress = true;
            game.updateBoard(2,clickOrDrag,cursor);
            clickOrDraw =0;
            eventInProgress = false;
        }
    }
    
    
    function handleMousemove(evt)
    {
        var offset = findPos(el);
        clickOrDrag = 1;
        //update mouse coords
        cursor.x = evt.clientX - offset.x;
        cursor.y = evt.clientY - offset.y;
        if(!eventInProgress)
        {
            eventInProgress = true;
            game.updateBoard(1,clickOrDrag,cursor);
            eventInProgress = false;
        }
    }
    
    function handleStart(evt)
    {
        evt.preventDefault();
        var el = document.getElementsByTagName("canvas")[0];
        var touches = evt.changedTouches;
        var offset = findPos(el);
        cursor.x = touches[0].clientX-offset.x;
        cursor.y = touches[0].clientY-offset.y;
        clickOrDrag = 0;
        
        if(!eventInProgress)
        {
            eventInProgress = true;
            game.updateBoard(0,clickOrDrag,cursor);
            eventInProgress = false;
        }
    }
    
    
    function handleMove(evt)
    {
        evt.preventDefault();
        var el = document.getElementsByTagName("canvas")[0];
        var touches = evt.changedTouches;
        var offset = findPos(el);
        clickOrDrag = 1;
        cursor.x = touches[0].clientX-offset.x;
        cursor.y = touches[0].clientY-offset.y;
        
        if(!eventInProgress)
        {
            eventInProgress = true;
            game.updateBoard(1,clickOrDrag,cursor);
            eventInProgress = false;
        }
    }
    
    
    function handleEnd(evt)
    {
        if(!eventInProgress)
        {
            eventInProgress = true;
            game.updateBoard(2,clickOrDrag,cursor);
            clickOrDraw =0;
            eventInProgress = false;
        }}
    
    function handleCancel(evt)
    {
        if(!eventInProgress)
        {
            eventInProgress = true;
            game.updateBoard(2,clickOrDrag,cursor);
            clickOrDraw =0;
            eventInProgress = false;
        }
    }
    
    function findPos (obj)
    {
        var curleft = 0,
        curtop = 0;
        
        if (obj.offsetParent) {
            do {
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
                
            } while (obj = obj.offsetParent);
            
            return {x: curleft-document.body.scrollLeft, y: curtop-document.body.scrollTop};
        }
    }
}

