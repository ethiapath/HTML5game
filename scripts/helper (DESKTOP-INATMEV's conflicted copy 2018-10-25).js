



function  facingAngle(startX, startY, targetX, targetY) {
  return Math.atan((startY-targetY)/(startX-targetX)); 
}
const sayStuff = (thingsToBeSaid, whereToSayThem, colorToSayThem = '#000000', howBigToSayThem = '14') => {
  // draw debug info
  c.font = howBigToSayThem + 'px serif';
  c.fillStyle = colorToSayThem;
  thingsToBeSaid.forEach( (i, n) => {
    // let iWidth = c.measureText(i).width;
    c.fillText(i, whereToSayThem.x, whereToSayThem.y + (howBigToSayThem * n));
  });
}


function moveOneRadTowardsTarget(startX, startY, targetX, targetY, radius) {
    var angleRad = facingAngle(startX, startY, targetX, targetY);
    let pos = {
      x: radius * Math.cos(angleRad),
      y: radius * Math.sin(angleRad)
    }; 
    if (startX > targetX && startY < targetY || startX > targetX && startY > targetY) {
      pos.x = -pos.x;
      pos.y = -pos.y;
    }
    return pos;
}

const detectCollison = (rect1, rect2, action) => {
  if (rect1.x < rect2.x + rect2.size &&
    rect1.x + rect1.size > rect2.x &&
    rect1.y < rect2.y + rect2.size &&
    rect1.size + rect1.y > rect2.y) {
     // collision detected!
     action(rect1, rect2);
     return true;
 }
 return false;
}

const isWithinWindow = o => o.x > 0 && o.x < canvas.width && o.y > 0 && o.y < canvas.height; 

const getObjName = obj => obj.__proto__.constructor.name;


// this is just a wraper so that when forEach is called from an object it acts like a for in loop
// it's also a bad idea in retrospect but I'm already using in a few places and don't want to change.
Object.prototype.forIn = function (callback) {
  Object.entries(this).forEach( (d, i) => { callback(d[0], this, i, d);});
}



const getAllOfName = name => 
  entities.filter( e => {
    e.__proto__.constructor.name === name
});

const zombieSpeeder = getAllOfName('zombie').forEach( z => z.d = speed );



