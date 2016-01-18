/* Game Piece
The user wins when he/she successfully arranges 6 of these within the boundaries of the puzzle.
 
Method Summary
 
    Public Methods:
        
        this.isMouseOver(cursor) - determines if the cursor is over itself.
        this.is/setSelected() - flag used by gameBoard for rotating the piece.
        this.findDistanceToNearestVertex(puzzle) - used to find a vertex within the puzzle to snap the piece to.
        this.redraw() - redraws piece, adds highlights if it is in motion.
        this.setMoving(boolean) - flag moving is used to determine whether a highlight should be drawn around itself.
        this.getMoving() -
        this.setIndex(index) - var index stores the index in pieces array in gameBoard.
        this.getIndex() -         
        this.updateLocation(coord) - updates coords and x,y when piece is moved by client.
        this.rotate(deg) - hard coded only rotate in 90 degree increments.
        this.snapToVertex(snapDistance) - adds snap distance to coords and x,y values.
        this.rescale(screenScale) - rescales piece based on screenScale/ screen size.
        this.clearDrag() - resets flag used to determine if an offset should be calculated when moving piece. Set in updateLocation.
        this.setDrag() - sets flag
        this.centerAtLocation - used to place piece at cursor when user drags piece from tray.
 
    Private Methods:
 
        getDistanceBetween(point1,point2) - caculates distance between x and y values of two points.
        isCloser(point1, point2) - returns true if point1 is "less" than point2
        isPointInPoly(poly, point) - returns true if point is in poly
 */

var path = "HHM/tangramsGame/sprites/nickAmp.png";
var path1 = "HHM/tangramsGame/sprites/scottAmp.png";
var path2 = "HHM/tangramsGame/sprites/rolfAmp.png";
var path3 = "HHM/tangramsGame/sprites/harryDrum.png";
var path4 = "HHM/tangramsGame/sprites/ryanHorn.jpg";
var path5 = "HHM/tangramsGame/sprites/jesseAmp.png";

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


function gamePiece(srcImage)
{
    var canvas = document.getElementById("gameCanvas");
    var c = canvas.getContext("2d");

    var index = -1;
 
    var image = srcImage;
    var x = 0;
    var y = 0;
    var width = image.width;
    var height = image.height;
    
    var	originalCoords = [];
    
    originalCoords[0] = new coordinate(x, y);
    originalCoords[1] = new coordinate(x+width, y);
    originalCoords[2] = new coordinate(x+width, y+height);
    originalCoords[3] = new coordinate(x, y+height);

    var coords = copyCoords(originalCoords);

    //console.log("in gamePiece coords are"+ originalCoords[0].x);
    var onBoard = false;
    
    var moving = false; // used to determine if highlight around piece should be drawn
    var selected = false; //used to differentiate between selecting and rotating.
    var degrees=0;
    
    var drag = false; // used to detrmine if an offset must be calculated when piece is moved.
    var xOffset = 0;  // offset between image location and mouse location
    var yOffset = 0;
  

    this.getCoords = function()
    {
        return coords;
    }
    
    this.getImage = function()
    {
        return image;
    }
    
    this.isMouseOver = function(mouseCoords)
    {
        // pass it and coords to isPointinPoly()
        //console.log("checking mouse over");
        return isPointInPoly(coords,mouseCoords);
    }
    
    this.isSelected = function()
    {
        return selected;
    }
    
    this.setSelected = function(booleanState)
    {
        selected = booleanState;
    }

    this.findDistanceToNearestVertex = function(currentPuzzle)
    {
        var newDeltaXY = new coordinate();
        var curDeltaXY = new coordinate(10000,10000); // not infinity, but sufficiently large.
        //console.log("coords[o].x" + coords[0].x);
        
        for (var i = 0; i<coords.length; i++)
        {
            for(var j = 0; j<currentPuzzle.length; j++)
            {
                for(var k =0; k<currentPuzzle[j].length; k++)
                {
                    var newDeltaXY = getDistanceBetween(coords[i],currentPuzzle[j][k]);
                    //console.log("DetlaXY: x" + newDeltaXY.x + " ,y" + newDeltaXY.y );
                
                    if(isCloser(newDeltaXY, curDeltaXY))
                    {
                        //console.log("newDetlaXY: x" + newDeltaXY.x + " ,y" + newDeltaXY.y );
                        curDeltaXY = newDeltaXY;
                    }
                }
            }
        }
        return curDeltaXY;
    }
    
    this.reset = function()
    {
        for(var i = 0 ; i < coords.length; i++ ){
            coords[i].x = originalCoords[i].x;
            coords[i].y = originalCoords[i].y;
        }
    }
    
    this.redraw = function()
    {
        if((degrees % 360) === 0)
        {
            //   console.log("degress = 0");
            if(moving)
            {
                c.save();
                c.shadowColor = '#FFFFCC';
                c.shadowBlur = 10;
                c.shadowOffsetX = 2;
                c.shadowOffsetY = 2;
                c.drawImage(image, x, y,width,height);
                c.restore();
            }
            else
            {
                c.drawImage(image, x, y,width,height);
                
            }
            
            
            //c.fillStyle= "red";
            //c.fillRect(0,0,200,200);
            //    console.log("piece drawn");
        }else
        {
            var xcen = x + .5 * width;
            var ycen = y + .5 * height;
            
            c.save();
            c.translate(xcen, ycen);
            c.rotate((Math.PI/180)*degrees);
            c.drawImage(image, -width/2, -height/2,width,height);
            c.restore();
            
            
            if(moving){
                c.save();
                c.translate(xcen, ycen);
                c.rotate((Math.PI/180)*degrees);
                c.shadowColor = '#FFFFCC';
                c.shadowBlur = 10;
                c.shadowOffsetX = 2;
                c.shadowOffsetY = 2;
                c.drawImage(image, -width/2, -height/2,width,height);
                c.restore();
            }
        }
    }
    
    this.setMoving = function(state)
    {
        moving = state;
    }

    this.getMoving = function()
    {
        return state;
    }
    
    this.clearDrag = function()
    {
        drag = false;
    }
    
    this.setDrag = function()
    {
        drag = true;
    }
    
    this.setIndex = function(pieceIndex)
    {
        index = pieceIndex;
    }
    
    this.getIndex = function()
    {
        return index;
    }
    
    
    this.updateLocation = function(cursor)
    {
        var movementX = 0;
        var movementY = 0;
       
        if(!drag) // just clicked, establish offset
        {
            xOffset = cursor.x - x;
            yOffset = cursor.y - y;
            drag = true;
        }
        
        movementX = cursor.x - x - xOffset;
        movementY = cursor.y - y - yOffset;
        
        x = cursor.x - xOffset;
        y = cursor.y - yOffset;
        
        
        for(var i = 0; i<coords.length; i++)
        {
            coords[i].x += movementX;
            coords[i].y += movementY;
            
        }
    }
    
    this.centerAtLocation = function(cursor)
    {
       // console.log("location set in centerAtLocation");
        var newX = cursor.x - width/2;
        var newY = cursor.y - height/2;
        
        x = newX;
        y = newY;
        degrees = 0;
        //console.log("set location x" + x + "y" + y);
        for(var i = 0; i<coords.length; i++)
        {
            
            coords[i].x = originalCoords[i].x + newX;
            coords[i].y = originalCoords[i].y + newY;
            
            //  console.log("coordinate x" + coords[i].x + " y " + coords[i].y );
            // console.log("original coordinate x" + originalCoords[i].x);
            
        }
    }
    
    // piece is hard-coded to rotate 90 degress
    this.rotate = function(deg)
    {
        degrees += deg; // for drawn image
        var toCenX = x+width/2;
        var toCenY = y+height/2;
        for(var i = 0; i<coords.length; i++)
        {
            var transCoord = new coordinate(coords[i].x - toCenX, coords[i].y - toCenY);  // translate so that piece is centered about the orgin.
            var rotCoord = new coordinate();
            rotCoord.x =  transCoord.y;
            rotCoord.y = -1* transCoord.x;
            rotCoord.x += toCenX;
            rotCoord.y += toCenY;
            coords[i].x = rotCoord.x;
            coords[i].y = rotCoord.y;
        }
    }
    
    this.snapToVertex = function (snapDistance)
    {
        //console.log("updated snap Distance");
        x -= snapDistance.x;
        y -= snapDistance.y;
        for(var i = 0 ; i< coords.length; i++)
        {
            //console.log("updated snap Distance");
            coords[i].x -= snapDistance.x;
            coords[i].y -= snapDistance.y;
        }
    }
    
    this.rescale = function(screenScale)
    {
    //    console.log("scale " + screenScale );
        x *= screenScale;
        y *= screenScale;
    //    console.log("width before " + width);
        width *= screenScale;
        height *= screenScale;
    //    console.log("width after " + width);
        for(var i =0; i<coords.length; i++)
        {
            originalCoords[i].x *= screenScale;
            originalCoords[i].y *= screenScale;
            originalCoords[i].x = Math.floor(originalCoords[i].x);
            originalCoords[i].y = Math.floor(originalCoords[i].y);
            
            coords[i].x *= screenScale;
            coords[i].y *= screenScale;
            coords[i].x = Math.floor(coords[i].x);
            coords[i].y = Math.floor(coords[i].y);
        }
        
        return coords;
    }
    
    function copyCoords(originalCoords)
    {
        copyOfCoords = [];
        for(var i =0; i<originalCoords.length; i++)
        {
            copyOfCoords.push(originalCoords[i].copy());
        }
        return copyOfCoords;
    }
    
    function getDistanceBetween(shape,puzzle)
    {
        var newDeltaXY = new coordinate();
        newDeltaXY.x = shape.x - puzzle.x;
        newDeltaXY.y = shape.y - puzzle.y;
        return newDeltaXY;
    }
    
    
    // checks if the sum of point1.y,point1.y is less than the sum of point2.x,point2.y
    function isCloser(point1, point2)
    {
        var value1 =  Math.abs(point1.x) * Math.abs(point1.y)/2;
        var value2 =  Math.abs(point2.x) * Math.abs(point2.y)/2;
        
        if(value1<value2)
        {
            return true;
        }else
        {
            return false;
        }
    }
    
    // point in poly algorithm provided by:
    //+ Jonas Raoni Soares Silva
    //@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
    function isPointInPoly(poly, pt)
    {
        for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
            ((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y))
            && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x)
            && (c = !c);
        return c;
    }
}
    

