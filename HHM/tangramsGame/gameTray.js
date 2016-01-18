function gameTray()
{
    var canvas = document.getElementById("gameCanvas");
    var c = canvas.getContext("2d");
    
    var originalTrayLoc = new coordinate(0,405);
    var originalTrayWidth = 320;
    var originalTrayHeight = 55;
    var originalTrayItemMarginX = 10;
    var originalTrayItemMarginY = 4;
    var originalItemWidth = 48;
    var originalItemPadding = 2;
    
    var trayLoc = originalTrayLoc;
    var trayWidth = originalItemWidth;
    var trayHeight = originalTrayHeight;
    var trayItemMarginX = originalTrayItemMarginX;
    var trayItemMarginY = originalTrayItemMarginY;
    var itemWidth = originalItemWidth;
    var itemPadding = originalItemPadding;
    
    var trayItemIndex = -1;
    var trayItemCount = 0;
    var items = new Array();

    
    this.addItem = function(newImage)
    {
        var newHeight = newImage.height * itemWidth/newImage.width;

        var x = (itemWidth + itemPadding) * trayItemCount + trayItemMarginX;
        var y = trayLoc.y+trayItemMarginY;
       
     //   console.log("trayItem height " + newHeight + "width" + itemWidth+ "x" + x + "y" + y);

        var newItem = new gameTrayItem(newImage,x,y,itemWidth,newHeight);

        items[trayItemCount]= newItem;
        trayItemCount +=1;
    }
    
    this.redraw = function()
    {
        c.fillStyle = "#000066";
        c.fillRect(trayLoc.x,trayLoc.y,trayWidth,trayHeight);
        for(var i = 0; i<items.length; i++)
        {
            items[i].redraw();
        }
    }
    
    this.isCursorInTray = function(cursor)
    {
        if(cursor.x>trayLoc.x && cursor.x<trayWidth && cursor.y > trayLoc.y && cursor.y < trayLoc.y+trayHeight)
        {
            return true;
        }
        return false;
    }
    this.processClick = function(cursor) // sets index of selected item and returns it.
    {
       // console.log("cursor X "+ cursor.x + "y" + cursor.y);
        for(var i = 0; i<items.length; i++)
        {
            if(items[i].isMouseOver(cursor))
            {
                trayItemIndex = i;
                return;
            }
        }
        trayItemIndex = -1;
    }
    this.indexOfCur = function()
    {
        return trayItemIndex;
    }
    
    this.resetItems = function()
    {
        for(var i = 0; i<items.length; i++)
        {
            items[i].setOnBoard(false);
        }
    }
    
    this.setActive = function(index)
    {
        items[index].setOnBoard(false);
    }
   
    this.setInactive = function(index)
    {
        items[index].setOnBoard(true);
    }
    
    this.isItemActive = function(index)
    {
        return items[index].isOnBoard();
    }
    
    this.curItemIsOnBoard = function()
    {
        return items[trayItemIndex].isOnBoard();
    }
    
    this.setCurOnBoard = function(state)
    {
        items[trayItemIndex].setOnBoard(state);
       // console.log("item at trayItemIndex" + trayItemIndex + " state "+ state);
    }
    
    this.anItemIsSelected = function()
    {
        if(trayItemIndex === -1){
            return false;
        }
        return true;
    }
    
    this.rescale = function(screenScale)
    {
        trayLoc.x = originalTrayLoc.x * screenScale;
        trayLoc.y = originalTrayLoc.y * screenScale;
        trayWidth = originalTrayWidth * screenScale;
        trayHeight = originalTrayHeight * screenScale;
        trayItemMarginX = originalTrayItemMarginX * screenScale;
        trayItemMarginY = originalTrayItemMarginY * screenScale;
        itemWidth = originalItemWidth * screenScale;
        itemPadding = originalItemPadding * screenScale;
        for(var i = 0; i<items.length; i++)
        {
            items[i].rescale(screenScale);
        }
    }
}






