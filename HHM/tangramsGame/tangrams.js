var path = "HHM/tangramsGame/sprites/nickAmp.png";
var path1 = "HHM/tangramsGame/sprites/scottAmp.png";
var path2 = "HHM/tangramsGame/sprites/rolfAmp.png";
var path3 = "HHM/tangramsGame/sprites/harryDrum.png";
var path4 = "HHM/tangramsGame/sprites/ryanHorn.jpg";
var path5 = "HHM/tangramsGame/sprites/jesseAmp.png";

var menuHidden = true;

var nickAmp = new Image();
nickAmp.src = path;
nickAmp.width = 110;
nickAmp.height = 75;

var scottAmp = new Image();
scottAmp.src = path1;
scottAmp.width = 105;
scottAmp.height = 92;

var rolfAmp = new Image();
rolfAmp.src = path2;
rolfAmp.width = 95;
rolfAmp.height = 78;

var harryDrum = new Image();
harryDrum.src = path3;
harryDrum.width = 110;
harryDrum.height = 110;


var ryanHorn = new Image();
ryanHorn.src = path4;
ryanHorn.width = 130;
ryanHorn.height = 40;

var jesseAmp = new Image();
jesseAmp.src = path5;
jesseAmp.width = 120;
jesseAmp.height = 50;

var game;

function nextPuzzle()
{
    game.nextPuzzle();
}

function storePuzzle()
{
    game.storePuzzle();
}

function retrievePuzzle()
{
    game.retrievePuzzle();
}

function deletePuzzle()
{
    game.deletePuzzle();
}

function buildGameBoard(screenScale)
{
    var game = new gameBoard(screenScale);
    var soundEffects = new sounds();
   // var puzzles = getGamePuzzles();
    
    game.addPiece(nickAmp);
    game.addPiece(scottAmp);
    game.addPiece(rolfAmp);
    game.addPiece(harryDrum);
    game.addPiece(ryanHorn);
    game.addPiece(jesseAmp);
    
    game.addSounds(soundEffects);
    
    game.addPuzzles();
    return game;
}

/*
function log(msg)
{
  var p = document.getElementById('console.log');
  p.innerHTML = msg + "\n" + p.innerHTML;
}
*/



