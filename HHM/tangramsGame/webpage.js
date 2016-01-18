/*
 simply need to build out:
  done: the corresponding tables, create new user, HHMAdmin : 6Mufflers, database, etc.
  -the php to load the tables, using forms, JSON, $POST, validate data.
  -the javascript to pass/retrieve the object to/from php via AJAXs
  done:in progress: the html to display the info
 */

var showsLoaded = false;
var pageVisited = false;
var shows = null;
var authenticated = true;false;


// buttons for adding/removing/creating puzzles

//


window.addEventListener("beforeunload", resetCSS, false);


function addUpcomingShow(e){
    shows.addUpcomingShow(e);
}


function resetCSS()
{
    hideHomePage();
    alert("page refresh");
}
function home() // except "home" div should be renamed "home only"
{
    hideAddShows();
    hideShows();
    hideCanvas();
    hideTangramsMenu();
    hideBooking();
    hideAdminLogin();
    hideMenu();
    hideAdminPuzzleButtons();
    hidePress();
    hideTheBand();
    showHomePage();
}

function clearAddShowForm()
{
    // reset all the form attributes to blank.
    // also, wipe out all shows currently in list and reload them all since a new one is added.
    // Also, sort shows in display, somehow...
}


function showAddShowButton()
{
    var addShowButton = document.getElementById("addShowButton");
    addShowButton.style.display = "block";
}

function hideAddShowButton()
{
    var addShowButton = document.getElementById("addShowButton");
    addShowButton.style.display = "none";
}

function showAddShows()
{
    home();
    var addShowsEl = document.getElementById("addShows")
    addShowsEl.style.display = "block";
    //toggleMenu();
}

function hideAddShows()
{
    var addShowsEl = document.getElementById("addShows")
    addShowsEl.style.display = "none";
}

function hideHomePage()
{
    var homePageEl = document.getElementById("homePage");
    homePageEl.style.display = "none";
}

// check if a shows object has been instantiated. If not, make one. Else, call showShows

function showShows()
{
    home();
    var showShowsEl = document.getElementById("shows");
    showShowsEl.style.display = "block";
    //var showShowsTalbe = document.getElementById("showsTable");
  //  showsTable.style.display = "block";

    if(shows == null){
        shows = new upcomingShows();
    }
    shows.showShows(authenticated);
}

function hideShows()
{
    var showShowsEl = document.getElementById("shows");
    showShowsEl.style.display = "none";
  //  var hideShowsTable = document.getElementById("showsTable");
  //  hideShowsTable.style.display = "none";

}
function showAdminPuzzleButtons()
{
    var x = document.getElementsByClassName("adminPuzzleButtons");
    for(var i =0; i<x.length; i++)
        x[i].style.display = "inline";
}

function hideAdminPuzzleButtons()
{
    var x = document.getElementsByClassName("adminPuzzleButtons");
    for(var i =0; i<x.length; i++)
        x[i].style.display = "none";
}

function play()
{
    home();
    hideHomePage();
    var canEl = document.getElementById("gameCanvas");
    canEl.style.display = "block";
    if(authenticated){
        showAdminPuzzleButtons();
    }
    game.redrawBoard();
}

function hideCanvas()
{
    var canEl = document.getElementById("gameCanvas");
    canEl.style.display = "none";
}

function showCanvas()
{
    home();
    var canEl = document.getElementById("gameCanvas");
    canEl.style.display = "block";
}

function hideHomePage()
{

    var homePageEl = document.getElementById("home");
    homePageEl.style.display = "none";
}
function showHomePage()
{
    hideCanvas();
    var homePageEl = document.getElementById("home");
    homePageEl.style.display = "block";
}

function showBooking()
{
    home();
    var bookingPage = document.getElementById("booking");
    bookingPage.style.display = "block";
}

function hideBooking()
{
    var bookingPage = document.getElementById("booking");
    bookingPage.style.display = "none";
}

function showAdminLogin()
{
    home();
    showHomePage();
    var adminLoginPage = document.getElementById("adminLogin");
    adminLoginPage.style.display = "block";
}

function hideAdminLogin()
{
    var adminLoginPage = document.getElementById("adminLogin");
    adminLoginPage.style.display = "none";
}

function showPress()
{
    home();
    var pressMenuButton = document.getElementById("press");
    pressMenuButton.style.display = "block";

}

function hidePress()
{
    var pressMenuButton = document.getElementById("press");
    pressMenuButton.style.display = "none";
}

function showTheBand()
{
    home();
    var bandMenuButton = document.getElementById("theBand");
    bandMenuButton.style.display = "block";
}

function hideTheBand()
{
    var bandMenuButton = document.getElementById("theBand");
    bandMenuButton.style.display = "none";
}


function tangramsMenu()
{
    home();
    hideHomePage();
    var tangramsPage = document.getElementById("playTangrams");
    tangramsPage.style.display = "block";
    var playbuttonarea = document.getElementById("playbuttonarea");
    playbuttonarea.style.display = "block";

    var playbutton = document.getElementById("playbutton");
    playbutton.style.display = "block";
}

function hideTangramsMenu()
{
    var tangramsPage = document.getElementById("playTangrams");
    tangramsPage.style.display = "none";
}


function showMenu()
{
    var menuEl = document.getElementById("menu");
    var state = menuEl.style.display;

    if(state == ""){
        menuEl.style.display = "block";
    }else if(state === "block"){
        menuEl.style.display = "none";
    }else if (state === "none"){
        menuEl.style.display = "block";
    }
}

function hideMenu()
{
    var menuEl = document.getElementById("menu");
    menuEl.style.display = "none";
}


function quitGame()
{
    home();
    showHomePage();
}

function buildPage()
{

    var screenScale = fitToScreen();
    //console.log("screen scale" + screenScale);

    game = buildGameBoard(screenScale); // reset to screenScale once puzzle is built
    initEvents(game);

    /*if(!pageVisited){
        showCanvas();
        runIntro(showHomePage);
    }else{
        showHomePage();

    }
    */
}

function main()
{
    buildPage();

}
