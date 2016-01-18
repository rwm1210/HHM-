

function runIntro(callback)
{
    var logo = "HHM/tangramsGame/sprites/VanSticker600x270.png";
    var canvas = document.getElementById("gameCanvas");
    var c = canvas.getContext("2d");
    var to = new coordinate(-650,50);
    var from = new coordinate(450,50);
    var interval = 30;
    var graphic = new Image();
    graphic.src = logo;
    c.fillStyle = '#3E3E50';
    c.fillRect(0,0,canvas.width,canvas.height);
    glide(graphic,from,to,3500,20,callback);

    //startup();

    function glide(image, from, to, duration,interval, callback)
    {
        var timer = 0;
        var percentComplete = 0;
        //console.log(from.x +""+ from.y+ "" + to.x + "" + to.y);

        var pos = new coordinate(from.x, from.y);
        var travel =  new coordinate(to.x-from.x, to.y-from.y);
        //console.log("x "+ travel.x);

        var runGlide = setInterval (function(){
                                    if(timer <= duration){
                                    timer += interval;
                                    percentComplete = timer/duration;

                                    c.fillRect(pos.x,pos.y,image.width,image.height);

                                    var dx = travel.x * percentComplete;
                                    //console.log("dx " + dx);
                                    pos.x = from.x+travel.x*percentComplete;
                                    pos.y = from.y+travel.y*percentComplete;

                                    //console.log("x "+ pos.x);
                                    c.drawImage(image,pos.x,pos.y);
                                    }else{
                                    callback();
                                    clearInterval(runGlide);
                                    }
                                    },interval);
    }

}
