
function coordinate(newx,newy)
{
    this.x = newx;
    this.y = newy;
    
    this.copy = function(){
        var newCopy = new coordinate();
        newCopy.x = this.x;
        newCopy.y = this.y;
        return newCopy;
    }
}

function copyCoordinates(coords)
{
    newCoords = [];
    for(var i =0; i<coords.length; i++){
            newCoords.push(coords[i].copy());
    }
    return newCoords;
}

function copyPuzzleCoordinates(puzzleCoords)
{
    newPuzzleCoords = [];
    for(var i = 0; i<puzzleCoords.length; i++)
    {
        var piece = [];
        for(var j = 0; j<puzzleCoords[i].length; j++)
        {
            var coord = new coordinate();
            coord.x = puzzleCoords[i][j].x;
            coord.y = puzzleCoords[i][j].y;
            piece.push(coord);
        }
        newPuzzleCoords.push(piece);
    }
    return newPuzzleCoords;
}