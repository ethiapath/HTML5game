var canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var c = canvas.getContext('2d');


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
  moveSelf(to) {
    const actions = {
      up: () => {this.y -= this.d; },
      down: () => {this.y += this.d;},
      left: () => {this.x -= this.d;},
      right: () => {this.x += this.d;}
    }
    actions[to]();
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
      up: { value: 87, state: false },
      down: { value: 83, state: false },
      left: { value: 65, state: false },
      right: { value: 68, state: false }
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
     c.fillRect(this.x, this.y, this.size, this.size);
    //  rotate(this.facing, this.x, this.y);
  }

  // update player state from buttons state
  moving() {
    this.buttons.forEach( (direction) => {
      if(this.buttons[direction].state) {
        this.moveSelf(direction);
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
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
		c.stroke();
		c.fill();
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

function Circle(x, y, dx, dy, ax, ay, radius) {
	this.radius = radius;
    this.minRadius = radius
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.ax = ax;
	this.ay = ay;
  this.color = colorArray[Math.floor(Math.random() * colorArray.length)];

	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
		c.stroke();
		c.fill();
	}

	this.update = function() {
		if (this.x + this.radius > innerWidth - 1
            || this.x - this.radius < 1) {
			this.dx = - this.dx;
		}
		this.x += this.dx;
//		this.dx += this.ax;
		if (this.y + this.radius > innerHeight - 1
            || this.y - this.radius < 1) {
			this.dy = - this.dy;
		}
		this.y += this.dy;
        
		this.dy -= this.ay;
      
        // interactivity
    
    if (mouse.x - this.x < 50 && mouse.x - this.x > -50
        && mouse.y - this.y < 50 && mouse.y - this.y > -50) {
      if (this.radius < maxRadius) {
        this.radius += 1;
      }
    } else if (this.radius > minRadius){
      this.radius -= 1;
    }
      
      
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
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
		c.stroke();
		c.fill();
	}

	this.update = function() {
      this.x = mouse.x;
      this.y = mouse.y;
      
      this.draw();
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
let count = 0;
function animate() {


  let debugInfo = [
    'Debug Info:',
    entities[0].facing,
    count++
  ];
  const fontSize = '14';
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

  // update entities state and draw them
  entities.forEach( e => e.update());

  // draw debug info
  debugInfo.forEach( (i, n) => {
    // let iWidth = c.measureText(i).width;
    c.fillText(i, 5/*canvas.width - iWidth -10*/, (fontSize * n));
  });
}

// setInterval(function() {
  animate();
// }, 1000/1)
