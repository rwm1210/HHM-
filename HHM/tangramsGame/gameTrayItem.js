

function gameTrayItem(newImage,newx,newy,itemWidth,itemHeight)
{
    var canvas = document.getElementById("gameCanvas");
    var c = canvas.getContext("2d");
    
    var image = newImage;
   
    var originalX = newx;
    var originalY = newy;
    var originalWidth = itemWidth;
    var originalHeight = itemHeight;
    
    var x = originalX;
    var y = originalY;
    var width = originalWidth;
    var height = originalHeight;
    
    var onBoard = false;
    
    
    this.redraw = function()
    {
        c.drawImage(image,x,y,width,height);
       // console.log("item on board" + onBoard);
        if(onBoard)
        {
            c.fillStyle = 'rgba(255, 0, 0,.5)';
            c.fillRect(x,y,width,height);
        }
    }
    
    this.setOnBoard = function(state)
    {
        onBoard = state;
    }
    
    this.isOnBoard = function()
    {
        return onBoard;
    }
    
    this.rescale = function(screenScale)
    {
        console.log("screen scale is " + screenScale);
        height = originalHeight * screenScale;
        width = originalWidth * screenScale;
        x = originalX * screenScale;
        y = originalY * screenScale;
    }
    
    this.isMouseOver = function(cursor)
    {
        if(cursor.x > x && cursor.x < x+width && cursor.y > y &&  cursor.y < y+height )
        {
            return true;
        }
        return false;
    }
}