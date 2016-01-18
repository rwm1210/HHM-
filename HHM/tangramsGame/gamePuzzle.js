function gamePuzzle(newid, solutionVerts){

    
    var canvas = document.getElementById("gameCanvas");
    var c = canvas.getContext("2d");

    var id = newid;
    var originalSolution = solutionVerts;
    var solutions = copyPuzzleCoordinates(solutionVerts);
    //var color = puzzleColor;
 
    this.redraw = function()
    {
    //     console.log("draw puzzle shape");
        //  if(coords.length){
        
       // c.beginPath();
        //c.moveTo(coords[0].x, coords[0].y);
        /*
        for(var i = 0 ; i< coords.length; i++)
        {
            //  console.log("drew a line from" +coords[i].x +" "+ coords[i].y );
            c.lineTo(coords[i].x, coords[i].y);
        }
        c.lineWidth = 2;
        c.strokeStyle = color;
        c.closePath();
        c.stroke();
        //  }
         */
       // console.log("solutions . length" + solutions.length);
        for(var i = 0; i < solutions.length; i++)
        {
            c.beginPath();
     //     console.log("solutions . length" + solutions[i].length);
            c.moveTo(solutions[i][0].x, solutions[i][0].y);
            for(var j = 0; j < solutions[i].length; j++)
            {
                c.lineTo(solutions[i][j].x, solutions[i][j].y);
            }
            //c.strokeStyle = color;
           // c.fillStyle = color;
            c.fillStyle = "orange";
            c.closePath();
          //  c.stroke();
            c.fill();
            
        }
    }
    
    this.getId = function ()
    {
        return id;
    }
    
    this.getCoords = function()
    {
        return copyCoordinates(coords);
    }
    
    this.getSolutions = function()
    {
        return solutions;
    }
    
    this.rescale = function(newScale)
    {
        for(var i = 0; i<solutions.length; i++)
        {
            for(var j = 0; j<solutions[i].length; j++)
            {
                solutions[i][j].x *= newScale;
                solutions[i][j].y *= newScale;
                solutions[i][j].x = Math.floor(solutions[i][j].x);
                solutions[i][j].y = Math.floor(solutions[i][j].y);
              //  console.log("newScale x " + solutions[i][j].x + "y" + solutions[i][j].y);
            }
        }
    }
    
    this.isSolved = function(pieces)
    {
        //console.log("pieces .length is (checking solution)" + pieces.length);
        
        for (var i = 0; i < pieces.length; i++)
        {
            if(!pieceIsSolved(pieces[i].getCoords(), solutions[i]))
            {
               // console.log("puzzle not solved piece " + i + "is wrong" );
                return false;
            }
            
        }
        
       // console.log("puzzle is solved");
       // alert("puzzle is solved!");
        return true;
    }
    
    function pieceIsSolved(piece, solution)
    {
        //console.log("piece.length is" + piece.length);
       // console.log("solution.length" + solution.length);
        for(var i = 0; i< piece.length; i++)
        {
            //console.log("checking Piece");
            if(!coordinateIsPresent(piece[i],solution))
            {
                return false;
            }
          //  console.log("piece is solved");
            return true;
        }
    }
    
    function coordinateIsPresent(coord, solution)
    {
       // console.log("solution.length" + solution.length);
       // console.log("< br/> checking Coord x" + coord.x + " y " + coord.y);
        for(var i = 0; i< solution.length; i++)
        {
            //console.log("<br /> solution x " + solution[i].x + " y " + solution[i].y);
            //console.log("<br /> coord    x " + coord.x + " y " + coord.y);

            if(Math.abs(coord.x - solution[i].x)<4 && Math.abs(coord.y - solution[i].y))
            {
              //  console.log("coordinate is present");
                return true;
                
            }
        }return false;
    }
   
}


