// console.log(ResponsiveGamepad);

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




window.addEventListener('mousemove', function (event) {
  //	console.log(mouse);
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('resize', function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  init();
});

function rotate(angle, x, y) {
  c.translate(x, y);
  c.rotate(angle);
  c.translate(-x, -y);
}

/* usful for more acurate physics but not really important now
const masterControl = {
  startTime: Date.now(),
  currentTime: Date.now(),
  timeAlive: this.currentTime - this.startTime,
  getTimeAlive: () => {
    this.timeAlive = this.currentTime - this.startTime; 
    return this.timeAlive; 
  } 
}*/





console.log("stuff");

// this will be checked later and replaced entierly when presented with a new set of actions.
// 
const defaultActions = {
  send: {

  }
}
class NetworkWrapper {

  constructor(actions) {
    let preLoadActions;
    if (actions !== 'undefined') {
      preLoadActions = defaultActions;
    } else {
      preLoadActions = actions;
    }
    Object.entries(actions).forEach(([key, value]) => {
      this[key] = value;
    });

  }
  // eventHandler(eventType) {
  //   if (event !== 'undefined') {
  //     this[eventType] = event;
  //   } else if (this[eventType] !== 'undefined') {
  //     this[eventType](data);
  //   } else {
  //     console.log(
  //       'No event for ' 
  //       + eventType 
  //       + 'has been defined');
  //   }
  // }
  // send(data, event) {

  // }

}




function facingAngle(startX, startY, targetX, targetY) {
  return Math.atan((startY - targetY) / (startX - targetX));
}
const sayStuff = (thingsToBeSaid, whereToSayThem, colorToSayThem = '#000000', howBigToSayThem = '14') => {
  // draw debug info
  c.font = howBigToSayThem + 'px serif';
  c.fillStyle = colorToSayThem;
  thingsToBeSaid.forEach((i, n) => {
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
  Object.entries(this).forEach((d, i) => { callback(d[0], this, i, d); });
}

const getReturn = item => item;

const getWorldArray = () => entities;//getReturn( entities );

const getAllOfName = name =>
  getWorldArray().filter(e => {
    return e.__proto__.constructor.name === name
  });



class Entity {
  constructor(x, y) {
    this.observers = [];
    this.x = x;
    this.y = y;
    this.d = 1;
    this.size = 50;
  }
  draw() {

  }
  update() {
  }
  subscribe(f) {
    this.observers.push(f)
  }
  unsubscribe(f) {
    this.observers = this.observers.filter(subscriber => subscriber !== f)
  }
  notify(data) {
    this.observers.forEach(observer => observer(data))
  }
}

class Player extends Entity {
  constructor(x, y) {
    super(x, y);
    this.size = 50;
    this.d = 7;
    this.facing = 0;
    this.buttons = {
      up: {
        value: 87,
        state: false,
        action: () => { this.y -= this.d; }
      },
      down: {
        value: 83,
        state: false,
        action: () => { this.y += this.d; }
      },
      left: {
        value: 65,
        state: false,
        action: () => { this.x -= this.d; }
      },
      right: {
        value: 68,
        state: false,
        action: () => { this.x += this.d; }
      }
    }
    // store keydown event to game state in this.buttons obj
    document.addEventListener('keydown', event => {
      // this.keyPressTranslater(event); 
      this.buttons.forIn((k, o) => {
        if (event.keyCode === o[k].value) {
          o[k].state = true;
        }
      });
    });
    // recheck button state from keyup event
    document.addEventListener('keyup', event => {
      this.buttons.forIn((k, o) => {
        if (event.keyCode === o[k].value) {
          o[k].state = false;
        }
      });
    });
  }

  draw() {
    c.fillStyle = 'rgba(255, 100, 0, 0.5)';
    c.fillRect((this.x - this.size / 2), (this.y - this.size / 2), this.size, this.size);
    //  rotate(this.facing, this.x, this.y);
    sayStuff([
      epoch,
    ],
      {
        x: this.x + this.size / 2,
        y: this.y + this.size / 2
      });
  }

  // update player state from buttons state
  moving() {
    this.buttons.forIn((direction) => {
      if (this.buttons[direction].state) {
        this.buttons[direction].action();
      }
    });
  }

  update() {
    this.facing = facingAngle(this.x, this.y, mouse.x, mouse.y);

    // update game state from based on this.buttons state
    this.moving();

  }
}

class Zombie extends Entity {
  constructor(x, y) {
    super(x, y)
    this.zombie = true;
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
    c.fillRect((this.x - this.size / 2), (this.y - this.size / 2), this.size, this.size);
  }

  update() {
    let playerPos = {
      x: entities[0].x,
      y: entities[0].y
    };

    let pos = moveOneRadTowardsTarget(this.x, this.y, playerPos.x, playerPos.y, this.d);
    this.x += pos.x;
    this.y += pos.y;

  }
}

function Pointer(x, y) {
  this.radius = 5;
  this.x = x;
  this.y = y;
  this.color = '#000000';
  this.draw = function () {
    c.beginPath();
    c.arc((this.x - this.radius / 2), (this.y - this.radius / 2), this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.stroke();
    c.fill();
    sayStuff([score], { x: this.x + 10, y: this.y + 10 }, '#ff0000');
  }
  this.update = function () {
    if (mouse.x !== 'undefined' && mouse.y !== 'undefined') {
      this.x = mouse.x;
      this.y = mouse.y;
      this.draw();
    }
  }
}

class Bullet extends Entity {
  constructor(x, y) {
    super(x, y);
    this.size = 5;
    this.d = 10;
    this.color = '#000000';
    this.target = { x: entities[1].x, y: entities[1].y };
    this.isBackwards = (this.x > this.target.x && this.y < this.target.y || this.x > this.target.x && this.y > this.target.y);
    this.angle = facingAngle(entities[1].x, entities[1].y, entities[0].x, entities[0].y);

  }
  draw() {
    c.fillStyle = this.color;
    c.fillRect((this.x - this.size / 2), (this.y - this.size / 2), this.size, this.size);
  }
  update() {
    let movement = {
      x: this.d * Math.cos(this.angle),
      y: this.d * Math.sin(this.angle)
    };
    if (this.isBackwards) {
      movement.x = -movement.x;
      movement.y = -movement.y;
    }

    this.x += movement.x;
    this.y += movement.y;
  }
}

document.addEventListener('click', (event) => {
  projectiles.push(new Bullet(entities[0].x, entities[0].y));
  console.log('clicked!')
});





let levels = []

levels[0] = {
  goal: () => {
    return score > 100;
  },
  update: () => {
    entities.push(new Zombie((innerWidth * Math.random()), 0));
    // goal
    if (score > 100) { epoch++; }
  }
}

levels[1] = {
  goal: () => score > 500,
  update: () => {
    if (!(count % 120) && rate !== 1) { rate--; }

    // if (!(score % 10)) { rate /= 2;}
    if (entities.length < 1000 && !(count % rate)) {
      entities.push(new Zombie((innerWidth * Math.random()), innerHeight));
      entities.push(new Zombie(innerWidth, (innerHeight * Math.random())));
      entities.push(new Zombie(0, (innerHeight * Math.random())));
      entities.push(new Zombie((innerWidth * Math.random()), 0));
    }
    if (this.goal) { epoch++; }
  }
}

levels[2] = {
  hasRun: false,
  init: () => {
    // zombies get faster
    let zombies = entities.filter(e => e.hasOwnProperty('zombie'));
    zombies.forEach(e => e.d++);
  },
  update: () => {
    entities.push(new Zombie((innerWidth * Math.random()), innerHeight));
    // goal
    // if (score > 100) { epoch++; }
  }
}

let currentLevel = 'something';
let levelObj;

const levelLoader = (level) => {
  if (levels[level].hasOwnProperty('init') &&
    currentLevel !== level) {
    levels[level].init();
    levels[level].hasRun = true;
  }
  if (levels.length > level) {
    levels[level].update();
  } else {
    levels.push(level[0]);

  }
  currentLevel = level;
}


// global vars
let score = 0;
const countStart = 500;
let epoch = 0;
let count = 0;
let rate = 120;

var entities = [];

const zombieSpeeder = getAllOfName('zombie').forEach(z => z.d = speed);


var projectiles = [];

var startPos = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

// reset to init state and add players
function init() {
  rate = 120;
  count = 0;
  epoch = 0
  entities = [];
  projectiles = [];
  // create player
  entities.push(new Player(startPos.x, startPos.y));
  entities.push(new Pointer(mouse.x, mouse.y));
  // zombieSpeeder(5);
}

init();

// game loop  
const isNotString = e => typeof e !== 'string';

let numAnimationFrames = 0;
function animate() {

  numAnimationFrames++;
  // load the level
  // gameLoop();
  animateLoop();
  requestAnimationFrame(animate);
}

// all the main action happens in these two function calls
setInterval(gameLoop, 16);
animate();
// I think these are both async functions
// so the idea atleast is that the stuff happening in the game
// and the stuff being drawn doesn't get in each others way.




function animateLoop() {
  // wipe screen
  c.clearRect(0, 0, innerWidth, innerHeight);
  entities.forEach(e => { e.draw(); });
  projectiles.forEach(e => { e.draw(); });
  debugStuff();
  entities[1].update();
}

function gameLoop() {
  levelLoader(epoch);
  // c.fillStyle  = '#000000';//colorArray[Math.floor(Math.random() * colorArray.length)];
  // c.fillRect(0, 0, innerWidth, innerHeight);
  // update entities state and draw them
  // reset game if zombie touches player
  for (let i = 1; i < entities.length; i++) {
    detectCollison(entities[0], entities[i], (rect1, rect2) => {
      score = 0;
      init();
    });
  }
  // remove zombie if hit by projectile
  projectiles.forEach((i, j, a) => {
    i.update();
    for (let j = 1; j < entities.length; j++) {
      // I need to figure out a better way of doing this
      // or this algo is the only thing that needs the pos data in this way.
      tempPos = {
        x: entities[j].x - entities[j].size / 2,
        y: entities[j].y - entities[j].size / 2,
        size: entities[j].size
      };
      detectCollison(i, tempPos, (rect1, rect2) => {
        entities[j] = '';
        score++;
        // a[j] = '';
        // a = a.filter(isNotString);
      });
    }
  });
  // clean up
  let uncolided = entities.filter(isNotString);
  entities = uncolided;
  // if (entities.length <= 2) { init(); } // reset game if there are no zombies


  projectiles = projectiles.filter(isWithinWindow);
  for (let i = entities.length - 1; i >= 0; i--) {
    entities[i].update();
  }

  count++;
}

function debugStuff() {
  c.fillStyle = '#000000';
  let debugInfo = [
    '',
    'Debug Info:',
    'WASD - move | Click - shoot | ',
    entities[0].facing,
    'game counter: ' + count,
    'animate counter: ' + numAnimationFrames,
    'sync: ' + (count > numAnimationFrames ? 'game ahead' : 'lag'),
    'epoch: ' + epoch,
    'score: ' + score,
    'rate: ' + rate,
    'num entities: ' + entities.length,
    'num projectiles: ' + projectiles.length
  ];
  const fontSize = '14';
  c.font = fontSize + 'px serif';

  // entities.forEach( e => {
  // });
  // draw ui
  let ui = 'score: ' + score + '\n' + 'yoyo' + ' ';
  let iWidth = c.measureText(ui).width;
  c.fillText(ui, canvas.width - iWidth - 10, 10);
  // draw debug info
  debugInfo.forEach((i, n) => {
    // let iWidth = c.measureText(i).width;
    c.fillText(i, 5 /*canvas.width - iWidth -10*/, (fontSize * n));
  });
}


