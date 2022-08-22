function sleep(m) {return new Promise(res=>setTimeout(res,m))}

// note: circle radii are normalized on render
STEP_DISTANCE = .02
MARGIN = .14

unplacedCircles = []
placedCircles = []
maxX = 0;
minX = 0;
maxY = 0;
minY = 0;

class MemberCircle {
    x; y; r; name; imgurl;
    constructor(hours, name,imgurl) {
        this.name = name;
        this.imgurl= imgurl;
        this.r = (Math.sqrt(hours+.2)) * 10;
    }
}

function distance(a,b) {
    return Math.sqrt( Math.pow(b.x-a.x,2) + Math.pow(b.y-a.y,2) )
}
function isColliding(a,b,margin) {
    if(!margin) {margin=0}
    return distance(a,b) < a.r + b.r + margin
}
function getCollided(circle, margin) {
    for (let placedCircle of placedCircles) {
        if(isColliding(circle,placedCircle,margin)) {return placedCircle}
    }
    return null;
}

function placeCircleFromPoint(circle,pointX,pointY,angle,distance) {
    circle.x = pointX + distance*Math.cos(angle) //rads
    circle.y = pointY + distance*Math.sin(angle) 
}
function getAngleFromAToB(a,b) {
    // dot = a.x*b.x + a.y*b.y      
    // det = a.x*b.y - a.y*b.x    
    // return Math.atan2(det, dot) 
    return 2*Math.atan((b.y-a.y)/((b.x-a.x)+Math.sqrt((b.x-a.x)*(b.x-a.x)+(b.y-a.y)*(b.y-a.y))))
}

function generateCircleSizes(list) {
    // sort list
    // generate sizes
}
function placeCircle(circle) {
    // random starting position
    let angle = Math.random()*2*Math.PI-Math.PI
    let d = Math.max(maxX,Math.max(Math.abs(minX),Math.max(maxY, Math.abs(minY)))) + circle.r
    placeCircleFromPoint(circle,0,0,angle,d)
    
    // move inwards until touching
    let collided = null
    while(true) {
        collided = getCollided(circle,MARGIN);
        if(collided || d<=0) {break}
        d-=STEP_DISTANCE;
        placeCircleFromPoint(circle,0,0,angle,d)
        // redrawCircles(placedCircles.concat([circle])) // REDRAWWWWW = = = == = = = == = == = = = == 
        // await sleep(10) /// REDRAWWWWW
    }

    // rotate around collided circle
    let STEP_ANGLE = (STEP_DISTANCE/collided.r) * Math.PI*2
    STEP_ANGLE = STEP_ANGLE * (Math.random() < 0.5 ? 1 : -1) // randomize direction | -1/1 credit https://stackoverflow.com/questions/29109456/how-to-get-random-1-or-1-in-canvas-javascript
    let A = getAngleFromAToB(collided,circle)
    let a;
    for(a=A;a<A+Math.PI*2 && a>A-Math.PI*2;a+=STEP_ANGLE) {
        placeCircleFromPoint(circle,collided.x,collided.y,a,collided.r+circle.r+MARGIN+.1)
        if(getCollided(circle,MARGIN)) {console.log(circle);break}
        // redrawCircles(placedCircles.concat([circle])) // REDRAWWWWW = = = == = = = == = == = = = == 
        // await sleep(10) /// REDRAWWWWW
    }
    // rotate out of collided circle
    for(A=a; Math.abs(A-a)<Math.abs(STEP_ANGLE); a-=(STEP_ANGLE/5)) {
        console.log('doing')
        placeCircleFromPoint(circle,collided.x,collided.y,a,collided.r+circle.r+MARGIN+.1)
        if(!getCollided(circle,MARGIN)) {console.log('YEETED');break}

        // redrawCircles(placedCircles.concat([circle])) // REDRAWWWWW = = = == = = = == = == = = = == 
        // await sleep(10) /// REDRAWWWWW
    }

    // recalc bounds
    maxX=Math.max(maxX, circle.x+circle.r)
    maxY=Math.max(maxY, circle.y+circle.r)
    minX=Math.min(minX, circle.x-circle.r)
    minY=Math.min(minY, circle.y-circle.r)

    // redrawCircles(placedCircles.concat([circle])) // REDRAWWWWW = = = == = = = == = == = = = == 
    // await sleep(10) /// REDRAWWWWW
}


function placeCircles(circles) {
    // reset
    placedCircles = []
    unplacedCircles = circles

    // exit if empty
    if(circles.length == 0) {return}

    // normalize
    let max = Math.max.apply(Math,circles.map(circle=>circle.r))
    circles.forEach(circle=>{circle.r/=max})

    circles.sort((a,b)=>(b.r-a.r));
    let circle = unplacedCircles.shift()
    circle.x=0;circle.y=0;
    minY = minX = -(maxX = maxY = circle.r) // HAHA THIS IS SO COOL
    placedCircles.push(circle)

    while(unplacedCircles.length != 0) {
        let circle = unplacedCircles.shift()
        placeCircle(circle)
        placedCircles.push(circle)
    }
    console.log('done')
}

