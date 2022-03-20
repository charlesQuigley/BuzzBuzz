var canvas = document.querySelector('#myCanvas');
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


var numOfStars = 150;//150;

var showConstellation = "YES_CONSTEALLATION"

var isComet = "false";

starBlurFactor = 5;
starShadowColor = "rgb(255, 255, 50)";

var maxStarSize = 4;
var maxStarVelocity = 0.8;
var minStarVelocity = 0.2;

var backgroundColor = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
backgroundColor.addColorStop(0, "#001b3a");  //Dark Blue = #152238
backgroundColor.addColorStop(1, "#624aa1");

//"#152238"; //Dark Blue

var mouse = {
    x: null,
    y: null,
    radius: ctx.canvas.width / 8, //Defines the area around the mouse that particles are affected by.
}

window.addEventListener('mousemove',
     function(event){
        mouse.x = event.x;
        mouse.y = event.y;
});


var star = {
    id: 0,
    x:  0,
    y: 0,
    r: 0,
    vy: 0, //y velocity
    color: 'red',
    type: 'star'
}

var stars = [];

var comet ={
    id: 0,
    x:  0,
    y: 0,
    r: 0,
    vy: 0, //y velocity
    vx: 0, //x velocity
    color: 'rgba(0,0,0,0)',
    prevX: 0,
    prevY: 0,
    type: 'comet',
}

for(var i = 0; i < numOfStars; i++){

    //Deep Copy the star object using JSON.parse(JSON.stringify()).
    //Basically, if you just try to increment the object's variables,
    //then when you push the object into the array, that object is SHALLOW copied,
    //meaning that you're basically pointing to the star object.
    //So anytime you increment the variables of the star object, 
    //all the star objects in your array will change because they're just pointers to the same thing.

    //Deep copy allows you to fully copy the object. So, it creates a new instance of the object.
    //This new copy has its own memory allocation. It does NOT point to the original object.

    star.id = star.id + 1;
    star.y = Math.random() * ctx.canvas.height;

    let starCopy = JSON.parse(JSON.stringify(star));

    stars.push(starCopy);

    reposition_and_resize_star(stars[i]);

    reColorStar(stars[i], isComet);


}

console.log(stars);
drawStars(stars);


window.addEventListener('resize', function(){

    canvas.width = window.innerWidth;
    drawStars(stars);

});


function reposition_and_resize_star(star)
{
    star.x = Math.random() * ctx.canvas.width;
   
    star.r = Math.random() * (maxStarSize - 1) + 1;

    star.vy = Math.random() * (maxStarVelocity - minStarVelocity) + minStarVelocity;

}

function reColorStar(star, isComet){

        //Math.random() * (max - min) + min will give you [min, max) range
        var redValueRGB = Math.random() * (256 - 240) + 240;
        var blueValueRGB = Math.random() * (256 - 200) + 200;
        var greenValueRGB = Math.random() * (256 - 200) + 200;

        
        var alpha = 0;

        if(star.r > 0.9 * (maxStarSize-1))
        {
            alpha = 0.9;
        }
        else if(star.r > 0.4 * (maxStarSize-1))
        {
            alpha = 0.3;
        }
        else
        {
            alpha = 0.1;
        }
    
        if(isComet == "true")
        {
            alpha = 1.0;
        }

        star.color = "rgba(" +redValueRGB+","+ greenValueRGB+","+ blueValueRGB+","+ alpha+")";
}

function drawComet(comet)
{

    var tailX;
    var tailY;

    var dx, dy, slope;

    dy = comet.y - comet.prevY; //change in y position
    dx = comet.x - comet.prevX; //change in x position

    slope = dy / dx;

    //console.warn("dx: "+ dx);
    //console.warn("dy: "+ dy);    
    //console.warn("SLOPE: "+ slope);



    ctx.beginPath();

    ctx.fillStyle = "rgba(255,255,255, 1)";
    ctx.strokeStyle = "rgba(255,255,255, 1)";
    ctx.shadowBlur = starShadowColor;

    ctx.lineWidth = 5;

    ctx.moveTo(comet.x, comet.y);
    ctx.lineTo(comet.x - dx * 10, comet.y - dy * 10);
    ctx.stroke();

    ctx.lineWidth = 4.8;

    ctx.moveTo(comet.x - dx * 10, comet.y - dy * 10);
    ctx.lineTo(comet.x - dx * 15, comet.y - dy * 15);
    ctx.stroke();

    ctx.lineWidth = 4.6;

    ctx.moveTo(comet.x - dx * 15, comet.y - dy * 15);
    ctx.lineTo(comet.x - dx * 20, comet.y - dy * 20);
    ctx.stroke();

    ctx.lineWidth = 4.4;

    ctx.moveTo(comet.x - dx * 20, comet.y - dy * 20);
    ctx.lineTo(comet.x - dx * 30, comet.y - dy * 30);
    ctx.stroke();

    ctx.lineWidth = 4.2;

    ctx.moveTo(comet.x - dx * 30, comet.y - dy * 30);
    ctx.lineTo(comet.x - dx * 40, comet.y - dy * 40);
    ctx.stroke();

    ctx.lineWidth = 4.0;

    ctx.moveTo(comet.x - dx * 40, comet.y - dy * 40);
    ctx.lineTo(comet.x - dx * 60, comet.y - dy * 60);
    ctx.stroke();
    

    draw(comet);

    ctx.closePath();


}

function drawStars(stars)
{

    for(var i = 0; i < stars.length; i++)
    {
         draw(stars[i]);

        //Check mouse position with particle position
        let mouse_star_x = mouse.x - stars[i].x;
        let mouse_star_y = mouse.y - stars[i].y;
        let distance = Math.sqrt(mouse_star_x * mouse_star_x + mouse_star_y * mouse_star_y);

            
        //If the distance between the mouse and the star is within the range of the mouse's area + the stars radius
        //then we're going to implment a constellation effect using that star
        if(distance < mouse.radius + stars[i].r && showConstellation == "YES_CONSTELLATION")
        {
            constellation_effect(stars[i]);
        }
    }
}

function constellation_effect(starNearMouse){

    ctx.lineWidth = 1.2;
    
    ctx.fillStyle = starNearMouse.color;
    ctx.strokeStyle = starNearMouse.color;
    ctx.shadowColor = starNearMouse.color;

    for(var i = 0; i < stars.length; i++)
    {
        let distance = Math.sqrt( (starNearMouse.x - stars[i].x) * (starNearMouse.x - stars[i].x) 
        + (starNearMouse.y - stars[i].y) * (starNearMouse.y - stars[i].y));

        if(distance < ctx.canvas.width / 16) //80
        {

            ctx.beginPath();

            ctx.moveTo(starNearMouse.x, starNearMouse.y);
            ctx.lineTo(stars[i].x, stars[i].y);
            ctx.stroke();

            ctx.closePath();

        }

    }
   

}

function constellationToggle(x){

    showConstellation = x;
    
}

function draw(star){

    ctx.beginPath();

    if(star.type == "comet")
    {
        ctx.lineWidth = 3;    
        ctx.shadowBlur = star.r * 2;
    }
    else{
        ctx.lineWidth = 2;
        ctx.shadowBlur = star.r * starBlurFactor;
    }


    ctx.fillStyle = star.color;
    ctx.strokeStyle = star.color;
    ctx.shadowColor = starShadowColor;

    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);


    ctx.fill();
    ctx.stroke();

    ctx.closePath();



}



var iterations_until_comet = 200;
var animation_iterations = 0;

var timeDelta, timeLast = 0;

var fps, fpsInterval, startTime, now, then, elapsed;
fps = 30;

//Calc the time difference
fpsInterval = 1000 / fps;
then = Date.now();
startTime = then;

requestAnimationFrame(animate);

function animate(timeNow){

    //Call next frame
    requestAnimationFrame(animate);

    // calc elapsed time since last loop
    now = Date.now();
    elapsed = now - then;
    
    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {

        //Count the iteration. After a certain number of iterations,
        //a comet should appear
        animation_iterations++;

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

        //Clear Canvas for new frame
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();

        //Redraw Background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        isComet = "false";

        for(var i = 0; i < stars.length; i++)
        {
            stars[i].y = stars[i].y - stars[i].vy;

            //Reposition the stars once they go off screen
            if(stars[i].y < 0)
            {
                stars[i].y = ctx.canvas.height;
                reposition_and_resize_star(stars[i]);
                reColorStar(stars[i], isComet);
            }

        }

        drawStars(stars);

        comet.prevX = comet.x;
        comet.prevY = comet.y;
        
        comet.x = comet.x + comet.vx;
        comet.y = comet.y - comet.vy;

        drawComet(comet);


        if(animation_iterations >= iterations_until_comet)
        {

            iterations_until_comet = 400;

            animation_iterations = 0;
            isComet = "true";

            comet.color = "white";

            comet.vx = Math.random() * (30 - 25) + 25;
            if( (Math.random() * (1 + 1) - 1) < 0) 
            {
                comet.vx = -comet.vx;
            }

            comet.vy = Math.random() * (5 + 0) - 0;

            comet.y = Math.random() * ((0.8)*ctx.canvas.height - (0.2)*ctx.canvas.height) + (0.2)*ctx.canvas.height;

            if(comet.vx >= 0) //If comet is moving to the right
            {
                comet.x = 1; //start at the left
            }
            else //Comet is moving to the left
            {
                comet.x = ctx.canvas.width + 1; //So start at the right.
            }

            comet.r = maxStarSize + 5;

        }


    }

    

}






