//function loadSound
function sounds(){
    
    var sources = {
        "soonerOrLater": "HHM/tangramsGame/sounds/soonerOrLater.mp3",
        "dragSound": "HHM/tangramsGame/sounds/dragSound.mp3"
    };
    
    
    var soonerOrLater = document.createElement("AUDIO");
    soonerOrLater.setAttribute("id", "song");
    
    var dragSound = document.createElement("AUDIO");
    dragSound.setAttribute("id" , "dragSound");
    
    soonerOrLater.src = sources.soonerOrLater;
    dragSound.src = sources.dragSound;
    dragSound.preLoad = true;

    this.playDragSound = function()
    {
        dragSound.play();
    }

    this.playSong = function()
    {
        soonerOrLater.play();
    }
    this.pauseSong = function ()
    {
        soonerOrLater.pause();
    }
}

