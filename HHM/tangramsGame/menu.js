function homePage()
{
    var canvas = document.getElementBy("homePage");
    var c = canvas.getContext("2d");
    
    var backgroundPath = "";
    var height = 460;
    var width = 320;
    var redBorder = 5;
   // var background = new Image(backgroundPath);
    //background.width = width;
    //background.height = height;
    
    var logoPath = "HHM/tangramsGame/sprites/VanSticker600x270.png";
    var logoWidth = 280;
    var logoHeight = 126; // .45 x logoWidth
    var logoXloc = 20;
    var logoYloc = 50;
    var logo = new Image(logoPath);
    //logo.width = logoWidth;
    //logo.height = logoHeight;
    
    var buttonPath = ""
    var playHeight = 75;
    var playWidth = 150;
  //  var playButtonFontSize = 30; if using text rather than image.
    var playXloc = 85;
    var playYloc = 200;
    var playButton = new Image(buttonPath);
    //playButton.width = playButtonWidth;
    //playButton.height = playButtonHeight;
    
    
    this.rescale = function(screenScale)
    {
        width *= screenScale;
        height *= screenScale;
        logoWidth *= screenScale;
        logoHeight *= screenScale;
        playHeight *= screenScale;
        playWidth *= screenScale;
        
    }
    
    this.redraw = function()
    {
        c.fillStyle = "#ff0000";
        c.drawFillRect(0,0,width,height);
        c.fillStyle = "#00ffff";
        c.drawFillRect(redBorder,redBorder,(width-redBorder*2),(height-redBorder*2));
        c.fillStyle = "000000";
        c.drawFillRect = 
        c.drawImage(background,0,0,height,width);
        c.drawImage(logo,logoXloc,logoXloc,logoWidth,logoHeight);
        c.drawImage(playButton,playXloc,playYloc,playWidth,playHeight);
    }
}