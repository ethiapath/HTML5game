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