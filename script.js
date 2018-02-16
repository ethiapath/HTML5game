var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');
var audioCtx = new AudioContext();


var mouse = {
  x: undefined,
  y: undefined,
};

var maxRadius = 40;
var minRadius = 2;

var colorArray = [
  '#FF81AB',
  '#A07BE8',
  '#66CBFF',
  '#5CE886',
  '#F6FF71'
]

window.addEventListener('mousemove', function(event) {
//	console.log(mouse);
    mouse.x = event.x;
    mouse.y = event.y;
});

window.addEventListener('resize', function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  init();
});

// this is just a wraper so that when forEach is called from an object it acts like a for in loop
Object.prototype.forEach = function (callback) {
  Object.entries(this).forEach( (d, i) => { callback(d[0], this);});
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

class Entity {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.d = 1;
    this.size = 50;
  }
  draw() {

  }
  update() {
    this.draw();
  }
}
function  facingAngle(startX, startY, targetX, targetY) {
  return Math.atan((startY-targetY)/(startX-targetX)); 
}

function rotate(angle, x, y) {
  c.translate(x, y);
  c.rotate(angle);
  c.translate(-x, -y);
}


class Player extends Entity {
  constructor(x, y) {
    super(x,y);
    this.size = 50;
    this.d = 10;
    this.facing = 0;
    this.buttons = {
      up: { 
        value: 87, 
        state: false, 
        action: () => {this.y -= this.d; }
      },
      down: { 
        value: 83, 
        state: false,
        action: () => {this.y += this.d;}
      },
      left: { 
        value: 65, 
        state: false,
        action: () => {this.x -= this.d;}
      },
      right: { 
        value: 68, 
        state: false,
        action: () => {this.x += this.d;}
      }
    }
     // store keydown event to game state in this.buttons obj
    document.addEventListener('keydown', event => {
      // this.keyPressTranslater(event); 
      this.buttons.forEach( (k, o) => {
        if(event.keyCode === o[k].value) {
          o[k].state = true;
        }
      });
    });
    // recheck button state from keyup event
    document.addEventListener('keyup', event => {
      this.buttons.forEach( (k, o) => {
        if(event.keyCode === o[k].value) {
          o[k].state = false;
        }
      });
    });
   }
 
  draw() {
     c.fillStyle = 'rgba(255, 100, 0, 0.5)';
     c.fillRect((this.x - this.size/2), (this.y - this.size/2), this.size, this.size);
    //  rotate(this.facing, this.x, this.y);
  }

  // update player state from buttons state
  moving() {
    this.buttons.forEach( (direction) => {
      if(this.buttons[direction].state) {
        this.buttons[direction].action();
      } 
    });
  }

  update() {
    this.facing = facingAngle(this.x, this.y, mouse.x, mouse.y);
    
    // update game state from based on this.buttons state
    this.moving();

    this.draw();
  }
}

class Zombie extends Entity {
  constructor(x, y) {
    super(x, y)
    this.size = 50;
    this.d = 1;
    this.radius = 10;
    this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
  }
  
  draw() {
		// c.beginPath();
		// c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    // this.color = colorArray[Math.floor(Math.random() * colorArray.length)];
    c.fillStyle = this.color;
		// c.stroke();
    // c.fill();
    c.fillRect((this.x - this.size/2), (this.y - this.size/2), this.size, this.size);
  }
  
  update() {
    var playerPos = {
      x: entities[0].x, 
      y: entities[0].y
    };
    
    var pos = moveOneRadTowardsTarget(this.x, this.y, playerPos.x, playerPos.y, this.d);
    this.x += pos.x;
    this.y += pos.y;

    this.draw();
  }
}

function Pointer(x, y) {
	this.radius = 5;
	this.x = x;
	this.y = y;

  this.color = '#000000';

	this.draw = function() {
		c.beginPath();
		c.arc((this.x - this.radius/2), (this.y - this.radius/2), this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
		c.stroke();
		c.fill();
	}

	this.update = function() {
    if (mouse.x !== 'undefined' && mouse.y !== 'undefined') {
      this.x = mouse.x;
      this.y = mouse.y;
      this.draw();
    }
	}
}

var entities = [];

var startPos = {
  x: window.innerWidth/2,
  y: window.innerHeight/2
};

var x = 100;
var y = 100;

function init() {
  entities = [];
  // create player
  entities.push(new Player(startPos.x, startPos.y));
  entities.push(new Pointer(mouse.x, mouse.y));
  for (var i = 0; i <= 9; i += 1) {
      var x = innerWidth * (Math.random());
      var y = innerHeight * (Math.random());
      entities.push(new Zombie(x, y));
//      var dx = (Math.random() - 0.5) * 8;
//      var dy = (Math.random() - 0.5) * 8;
//      var ax = 0;//(Math.random() - 0.5);
//      var ay = 1;//(Math.random() - 0.5);
//      var radius = Math.random() * 20;
  }
}

init();

// game loop  
const countStart = 500;
let epochs = 0;
let count = -1;
function animate() {


  let debugInfo = [
    'Debug Info:',
    entities[0].facing,
    count--,
    epochs
  ];
  if (count < 0) {
    epochs++;
    init();
    count = countStart - epochs;
  }
  const fontSize = '14';
  c.fillStyle = '#000000';
  c.font = fontSize + 'px serif';
  entities[0].buttons.forEach((key, obj) => {
    debugInfo.push(key);
    obj[key].forEach( (k, o) => {
      debugInfo.push(k + ': ' + o[k])
    });
  });

  requestAnimationFrame(animate);
  // wipe screen
	c.clearRect(0, 0, innerWidth, innerHeight);

  // c.fillStyle  = '#000000';//colorArray[Math.floor(Math.random() * colorArray.length)];
  // c.fillRect(0, 0, innerWidth, innerHeight);
  // update entities state and draw them
  for (let i = entities.length-1; i >= 0; i--) {
    entities[i].update();
  }
  // entities.forEach( e => {

  // });

  // draw debug info
  debugInfo.forEach( (i, n) => {
    // let iWidth = c.measureText(i).width;
    c.fillText(i, 5/*canvas.width - iWidth -10*/, (fontSize * n));
  });
    entities[1].update();
}

// setInterval(function() {
  animate();
// }, 1000/1)
