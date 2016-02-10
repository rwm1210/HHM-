function fitToScreen()
{
    var gameArea = document.getElementById("gameArea");
    var canvas = document.getElementById("gameCanvas");
    var homePage = document.getElementById("homePage");
    var widthToHeight = 320/460; // the useable screen css pixel dimensions ratio of a website on iPhone 5.

    var screenScale = 1;
    // console.log("resize");
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    var newScreenScale = 0;
    var fontSizeHolder = 0;

    // case 1 window is to wide
    if(newWidthToHeight > widthToHeight){
        newWidth = newHeight * widthToHeight
        gameArea.style.width = newWidth + "px";
        gameArea.style.height = newHeight +"px";
    }
    // case 2 window is to tall
    if(newWidthToHeight< widthToHeight){
        newHeight = newWidth / widthToHeight;
        gameArea.style.width = newWidth + "px";
        gameArea.style.height = newHeight + "px";
    }


    gameArea.style.marginLeft = (-newWidth/2) + "px";
    gameArea.style.marginTop = (-newHeight/2) + "px";
    gameArea.style.padding = newWidth/100;


    newScreenScale = newWidth/320;

    fontSizeHolder = parseInt(window.getComputedStyle(gameArea).getPropertyValue("font-size"));
    if(resizeInit){
      originalFontSize= fontSizeHolder;
      resizeInit=0;
    }

    gameArea.style.fontSize = originalFontSize * newScreenScale;
    //newWidth = Math.floor(newWidth);
    //newHeight = Math.floor(newHeight);

    canvas.width = newWidth;
    canvas.height = newHeight;

    //homePage.width = newWidth;
    //homePage.height = newHeight;

    screenScale = newScreenScale;

    return screenScale;

}
