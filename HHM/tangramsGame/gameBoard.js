
/* Game Board
 a game board consists of 6 game pieces, a puzzle, and a tray containing the images of the 6 game pieces called items.  The pieces are loaded are hard coded into the gamePiece object and the puzzles are loaded from a database via AJAX request. The game board relies on calls from the events object to get input from the user and updates itself accordingly.

 Objects Used

        gamePiece - these are the pieces the user arranges within the boundaries of the puzzle. The user adds/removes these from the game board by dragging them to/from the gameTray.

        gameTray - The game tray contains an array of game items. It keeps track of the state of each game item and determines which (if any) of the items are clicked. Game pieces orginate from the gameTray.

        gameTrayItems - a minature represntation of a game piece. If the piece is unavailble to be dragged from the tray (on the board already) it is drawn red. There is a 1:1 correlation between the gameTrayItems and the gamePieces.

        gamePuzzle - a game puzzle is mainly a set of coordinates reperesenting the location that each game piece should be located in order to win.

        sounds - an object containing a reference to an audio tag in the DOM, preloaded with songs.

 Method Summary

    Public Methods

        this.addPiece(Image) - takes an initialized image object and builds a game piece as well as a corresponding tray item.

        this.addPuzzles() - simply calls this.retrievePuzzle(), may remove.

        this.addSounds(sounds) - takes a sounds object and stores it.

        this.nextPuzzle() - incements variable curPuzzle and/or sets to 0 (loop back to beginning).

        this.redrawBoard() - calls private functions redrawPieces(), redrawPuzzle(), and redrawTray() to redraw the entire game board.

        this.updateBoard() - called by events.js when an either a mouse or touch event occurs, a code of 0,1,2 is passed in to indicate which type of click or touch event needs to be processed. This method manages the adding/ removing pieces to the gameboard, the movement/rotation of the game pieces, the snapping of game pieces to the puzzle, and the determining of whether a puzzle is solved. It also manages the state of the tray items.

        this.storePuzzle() - only used in puzzle building mode which isn't accessible to the client. Its a mode I created to make creating and storing puzzles much easier. Makes a call to convertCurrentPiecesToJSON to prepare data for storage in database.

        this.deletePuzzle() - only used during the puzzle creation process. Client never has access unless client is developer




    Private Methods

        resetBoard() - called by nextPuzzle. Resets the game pieces to their starting state.

        whichPieceClicked() - determines which game piece, if any, is clicked. Returns index in pieces where shape is found.

        rescalePieces() - iterates through pieces array and calls pieces.rescale() on each piece.

        redrawPieces() - iterates through pieces array and calls pieces.redraw() on each piece.

        moveIndexToFrontOfArray(index) - piece at index is moved to the front of the render array.

        retrievePuzzles() - gets puzzles from database, converts them from JSON into puzzle objects which are better suited for game logic and iteration.

*/


function gameBoard(scale)
{
    //var adminPageUnlocked = false;
    var canvas = document.getElementById("gameCanvas");
    var c = canvas.getContext("2d");
    var songPlaying = false;
    var sound;
    var creatingPuzzle = false;
    var screenScale = scale;

    var fontSize = 24 * scale;
    var font = "Comic Sans MS";
    var originalHeight = 460;
    var originalWidth = 320;

    var height = originalHeight * scale;
    var width = originalWidth * scale;

    var scoreLocX = 20 * scale;
    var scoreLocY = 30 * scale;

    var quitLocX = 260 * scale;
    var quitLoxY = 30 * scale;
    var quitWidth = 75 * scale;
    var quitHeight = 50 * scale;

    var puzzles = [];
    var adminSolution = {x:0,y:width};
    var pieces = [];

    var harryDrumSet = 0;


    //store the pieces drawn to board. Constantly resorted to current piece is drawn on top.
    var piecesInPlay = []; // this is going to just an array of idexes of pieces in the pieces array. This will be sorted and this way the draw function can hop through pieces and render as necessary.
    var tray = new gameTray(scale);
    tray.rescale(scale);

    var indexInPieces = -1;
    var indexInPiecesInPlay = -1;
    var pieceCount = 0;
    var curPuzzle = -1;

    var threshold = new coordinate(30,30); //used when snapping piece to puzzle
    threshold.x *= scale;
    threshold.y *= scale;

    var scale = 1;

//-- Public Methods

    this.addPiece = function(newImage)
    {
        var piece = new gamePiece(newImage);
        piece.setIndex(pieceCount);
        pieceCount +=1;


       // var locCoord = piece.getCoords();
        //console.log("coord at [1].x" + locCoord[1].x);
        piece.rescale(screenScale);

        //console.log("coord at [1].x after rescale " + locCoord[1].x);
        pieces.push(piece);
       //locCoord = pieces[0].getCoords();
      //console.log("coord at [1].x after rescale" + locCoord[1].x);
        tray.addItem(newImage);
    }

    this.addPuzzles = function()
    {
        retrievePuzzles();
    }

    this.addSounds = function(soundEffects)
    {
        sound = soundEffects;
    }

    this.nextPuzzle = function()
    {
        curPuzzle = (curPuzzle === (puzzles.length -1) ? 0 : curPuzzle+=1);
        resetBoard();
        this.redrawBoard();

    }

    this.redrawBoard = function()
    {
        c.fillStyle = '#3E3E50';
        c.fillRect(0,0,width,height);
        redrawPuzzle();
        tray.redraw();
        //draw score
        c.font = fontSize+"px" + " " + font;
        c.fillstyle = "black";
        var level = curPuzzle+1;
        c.fillText("Level: "+ level ,scoreLocX,scoreLocY);

        //draw quit button
       // c.fillstyle =
        //c.fillRect(quitLocX,quitLoxY,quitWidth,quitHeight);
        c.fillText("Back", quitLocX, quitLoxY);
        redrawPieces();
    }

    this.rescaleBoard = function(screenScale)
    {
        var height = originalHeight * scale;
        var width = originalWidth * scale;

        rescalePieces(screenScale);
        tray.rescale(screenScale);
        for(var i = 0; i<puzzles.length; i++)
        {
        puzzles[i].rescale(screenScale);
        }
        this.redrawBoard();
    }

    this.updateBoard = function(eventCode,clickOrDrag,cursor)
    {
        switch (eventCode){

            case 0:// "mouse down or touch start"

                indexInPieces = -1; // assume no piece clicked. Value is set below if a piece is found to be selected

                // check if piece in game board is clicked
                indexInPiecesInPlay = whichPieceClicked(cursor);
                //console.log("piece index is " + indexInPiecesInPlay);
                if(indexInPiecesInPlay != -1)  // if a game piece was clicked
                {
                    indexInPieces = piecesInPlay[indexInPiecesInPlay];
                    if(indexInPieces !=3)
                    {
                        harryDrumSet =0;
                    }

                    if(piecesInPlay.length >0)
                    {
                        if(indexInPiecesInPlay != 0) // if a different piece selected...
                        {
                            pieces[indexInPieces].setSelected(false);
                            moveIndexToFrontOfArray(indexInPiecesInPlay);
                            indexInPiecesInPlay = 0;
                           //console.log("pieces In Play");
                            for(var i = 0; i < piecesInPlay.length; i++)
                            {
                             //console.log("piece " + i + " is " + piecesInPlay[i]);
                            }//
                        }
                    }
                    this.redrawBoard();
                }
                // check if item in tray is clicked
                tray.processClick(cursor);
                if(tray.anItemIsSelected())
                {
                    harryDrumSet =0;
                    if(!tray.curItemIsOnBoard())
                    { //user clicks available game piece in tray

                        if(!songPlaying)
                        {
                            sound.playSong();
                        }

                        tray.setCurOnBoard(true);
                        indexInPieces = tray.indexOfCur();

                        pieces[indexInPieces].setSelected(true); //if piece clicked again it should rotate
                        pieces[indexInPieces].centerAtLocation(cursor); //piece appears centered around cursor
                        pieces[indexInPieces].setMoving(true); //piece should draw a highlight around itself
                        piecesInPlay.unshift(pieces[indexInPieces].getIndex()); // index of game piece in pieces array is now first value in render array.
                        indexInPiecesInPlay = 0;
                        coords = pieces[indexInPieces].getCoords();
                        this.redrawBoard();
                    }
                }

                if(clickedQuit(cursor)){
                    endGame();
                }

                break;


            case 1: // "mouse move or touch move"

                if (indexInPieces != -1)
                { //if a piece is selected, move it.
                    pieces[indexInPieces].setMoving(true);
                    pieces[indexInPieces].updateLocation(cursor);
                    this.redrawBoard();
                }
                break;

            case 2: // "mouse up or touch end, touch cancel"

               if(indexInPiecesInPlay != -1){ // a piece had been clicked...
                   if(tray.isCursorInTray(cursor)){  //...and was returned to the tray
                       tray.setActive(indexInPieces); //can now by dragged to board from tray
                       //console.log("removing" + indexInPiecesInPlay);
                       pieces[indexInPieces].setSelected(false);
                       piecesInPlay.splice(indexInPiecesInPlay,1); //no longer in play
                       harryDrumSet =0;
                    }else{ //...and it remains on the board...
                        if (clickOrDrag === 0 ){ //...and not dragged so it rotates.
                           if(pieces[indexInPieces].isSelected()){
                               //non-current pieces first must be selected before they rotate.
                                 pieces[indexInPieces].rotate(90);
                               if(indexInPieces == 3){
                                   harryDrumSet+= 90;
                                   //console.log(harryDrumSet);
                               }

                           }else{
                               pieces[indexInPieces].setSelected(true);

                           }
                        }

                        pieces[indexInPieces].clearDrag();
                    }

                   if(!creatingPuzzle)// if in puzzlecreation mode, don't snap pieces to puzzle or check for solution
                   {
                       var distance = pieces[indexInPieces].findDistanceToNearestVertex(puzzles[curPuzzle].getSolutions());

                       if(Math.abs(distance.x) <= threshold.x && Math.abs(distance.y) <= threshold.y)
                       {
                           pieces[indexInPieces].snapToVertex(distance);
                           this.redrawBoard();

                           if(puzzles[curPuzzle].isSolved(pieces,4))
                           {
                               this.redrawBoard();
                               setTimeout(function(){this.nextPuzzle();
                                          alert(" you solved the puzzle!");},1000);
                           }
                           if(harryDrumSet >= 1080)
                           {
                               alert("You will now be taken to the admin login page");
                               showAdminLogin();
                               harryDrumSet=0;
                           }
                       }
                   }

                   pieces[indexInPieces].setMoving(false);
                   pieces[indexInPieces].clearDrag();
                   indexInPieces = -1;
                   this.redrawBoard();

               }
            break;
        }
    }


//-- PRIVATE METHODS--

    function resetBoard()
    {
        // reset game pieces
        for(var i = 0; i< pieces.length; i++)
        {
           // pieces[i].setOnBoard(false); //now item won't be drawn
            //pieces[i].setMoving(false); //nor will there be a hightlight around it.
            pieces[i].reset();
            piecesInPlay = [];
        }
        tray.resetItems();
    }

    function whichPieceClicked(mouseCoords)
    {

        //console.log("mouse coords x " + mouseCoords.x + "mouse coords y" + mouseCoords.y);
        for (var i =0; i < piecesInPlay.length; i++)
        {

          //console.log("checking index" + piecesInPlay[i]);
            var localcoords = pieces[piecesInPlay[i]].getCoords();

          //console.log("index accordign to the piece itself is" + localcoords);
            for(var j = 0 ; j<localcoords.length; j++){
                //console.log("which piece clicked, x " + localcoords[j].x + " y " + localcoords[j].y );
            }
            if (pieces[piecesInPlay[i]].isMouseOver(mouseCoords))
            {

                return i;
            }
        }
        return -1;
    }

    function rescalePieces(newScale)
    {
        for(var i = 0; i<pieces.length; i++)
        {
            pieces[i].rescale(newScale);
        }
    }

    function redrawPieces(){ // draw piecesInPlay[0] last.
        for(var i = piecesInPlay.length-1; i>-1; i--){
            var index = piecesInPlay[i];
            pieces[index].redraw();
        }
    }

    function redrawPuzzle()
    {
        if(curPuzzle != -1)
            puzzles[curPuzzle].redraw();
    }

    function shiftPiecesInPlayUp()
    {
        for(var i = 1; i< piecesInPlay.length; i++)
        {
            piecesInPlay[i].shiftRenderOrderUp();
        }
    }

    function shiftPiecesInPlayDown(startingPoint)
    {
        for(var i = startingPoint; i< piecesInPlay.length; i++)
        {
            piecesInPlay[i].shiftRenderOrderDown();
        }
    }

    function moveIndexToFrontOfArray(indexToBeMoved)
    {
        var pieceIndexValue = piecesInPlay[indexToBeMoved];
        piecesInPlay.splice(indexToBeMoved,1);
        piecesInPlay.unshift(pieceIndexValue);
    }

    function clickedQuit(cursor)
    {
        var c = cursor;
        var xmin = quitLocX;
        var xmax = quitLocX + quitWidth;
        var ymin = quitLoxY;
        var ymax = quitLoxY + quitHeight;

        if(c.x > xmin && c.x < xmax && c.y> ymin && c.y < ymax)
        {
            return true;
        }else
        {
            return false;
        }
    }

    function endGame()
    {
        // resets the pieces, board, etc.
        sound.pauseSong();
        songPlaying = false;
        quitGame();// located in tangrams.js that will switch back to the homepage.
    }
//-- AJAX methods

    this.storePuzzle = function()
    {
        var oReq = new XMLHttpRequest();
        oReq.open("POST", "/HHM/tangramsGame/storePuzzle.php", true);
        oReq.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

        var puzzle = convertCurrentPiecesToJSON();

        //console.log("converted and here is an x" + puzzle.piece1.coord1.x);
        var json_coords = JSON.stringify(puzzle);
        //console.log(json_coords);

        oReq.onreadystatechange = function(){
            if(oReq.readyState ===4)
            {
                if(oReq.status===200)
                {
                    callback(oReq.responseText);
                }
            }
        };

        function callback(data)
        {
            var response = JSON.parse(data);
            if(response == "login required")
            {
                alert("please first login");
                showAdminLogin();
            }else if(response == "session expired"){
                alert("please login again, for security reasons your session timed-out");
                showAdminLogin();
            }else{
                alert(response);
            }
        }
        oReq.send(json_coords);
    }

    function reqListener() {
    //console.log("in JavaScript now...");
        //console.log(this.responseText);
    }

    function retrieveListener() {
        //console.log("retireve Listener");
        //console.log(this.responseText);
    }
    function retrievePuzzles()
    {
        //console.log("in retrieve puzzle");
        var oReq = new XMLHttpRequest();

        oReq.onreadystatechange = function(){
            if(oReq.readyState ===4){
                if(oReq.status===200){
                   callback(oReq.responseText);
                }
            }
        };

        function callback(data){

            var jsonPuzzle = JSON.parse(data);
            for(puzzleItor in jsonPuzzle)
            {
                var puzzle = convertJSONtoGamePuzzle(jsonPuzzle[puzzleItor]);
                puzzles.push(puzzle);
            }
            curPuzzle = (puzzles.length > 0 ? 0: -1);
            for(var i = 0; i<puzzles.length; i++)
            {
                puzzles[i].rescale(screenScale);
            }
        }

        oReq.open("get", "/HHM/tangramsGame/retrievePuzzle.php",true);
        oReq.send();
        oReq.onload = retrieveListener;
        //console.log(oReq.submittedData);
        return puzzles;
    }

    this.deletePuzzle = function()
    {
        //remove the current puzzle on gameboard from the database
        var puzzleId = puzzles[curPuzzle].getId();

        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.open("post", "/HHM/tangramsGame/deletePuzzle.php", true);
        oReq.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        oReq.send(puzzleId);

        //remove the puzzle from the gameboard too
        puzzles.splice(curPuzzle,1);
        curPuzzle--; // display the previous puzzle
        this.redrawBoard();
    }

    // takes data from database, builds and returns a game puzzle
    function convertJSONtoGamePuzzle(json)
    {
        //console.log("converting DB to puzzles");
        var id = json['id'];
        var jsonPuzzle = json['puzzle'];
        var puzzleCoords = [];

        for(piece in jsonPuzzle)
        {
            var newpiece = [];
            for(coord in jsonPuzzle[piece])
            {
                var newcoord = jsonPuzzle[piece][coord];
                newpiece.push(newcoord);
            }
            puzzleCoords.push(newpiece);
        }

        var newPuzzle = new gamePuzzle(id, puzzleCoords);
        return newPuzzle;
    }


    function convertCurrentPiecesToJSON(){
        var puzzle = {};
        for(var i = 0; i< pieces.length; i++)
        {
            var piece = {};
            var coords = pieces[i].getCoords();
            //console.log("in converting pieces to JSON, scale is" + screenScale);
            for(var j = 0; j<coords.length; j++)
            {
                var index = "coord" +j;
                var coord = coords[j].copy();

                coord.x /= screenScale;
                coord.y /= screenScale;

                piece[index] = coord;
                //console.log("inserted coordx into piece" + piece[index].x);
                //console.log("insertd coord into piece" + piece[index].y);
            }

            index = "piece" + i;
            puzzle[index] = piece;
        }
        return puzzle;

    }

}
