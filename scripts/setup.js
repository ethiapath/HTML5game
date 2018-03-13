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
Object.prototype.forIn = function (callback) {
  Object.entries(this).forEach( (d, i) => { callback(d[0], this, i, d);});
}


function rotate(angle, x, y) {
  c.translate(x, y);
  c.rotate(angle);
  c.translate(-x, -y);
}


var entities = [];

var projectiles = [];

var startPos = {
  x: window.innerWidth/2,
  y: window.innerHeight/2
};
let levels = [
  function() {
    this.goal = () => {
      return score > 100;
    }
    entities.push(new Zombie( (innerWidth * Math.random()), 0));
    // goal
    if (score > 100) { epoch++; }
  },
  function() {
    this.goal = () => { return false; }
    // level load
    if (!(count % 120) && rate !== 1) { rate--; }
    
    // if (!(score % 10)) { rate /= 2;}
    if (entities.length < 1000 && !(count % rate)) {
      entities.push(new Zombie( (innerWidth * Math.random()), innerHeight));
      entities.push(new Zombie( innerWidth, (innerHeight * Math.random())));
      entities.push(new Zombie( 0, (innerHeight * Math.random())));
      entities.push(new Zombie( (innerWidth * Math.random()), 0));
    }
    if ( !(score % 100) ) { epoch++; }
  }
]
const levelLoader = (level) => {
  if (levels.length > level) {
    levels[level]();
  } else {
    let zombies = entities.filter( e => e.hasOwnProperty('zombie'));
    zombies.forEach( e => e.d++ );
  }
}


const isWithinWindow = o => o.x > 0 && o.x < canvas.width && o.y > 0 && o.y < canvas.height; 

var x = 100;
var y = 100;
let score = 0;
const countStart = 500;
let epoch = 0;
let count = 0;
let rate = 120;
function init() {
  rate = 120;
  count = 0;
  epoch = 0
  entities = [];
  projectiles = [];
  // create player
  entities.push(new Player(startPos.x, startPos.y));
  entities.push(new Pointer(mouse.x, mouse.y));
}

init();

// game loop  
const isNotString = e => typeof e !== 'string';

function animate() {

  // load the level
  levelLoader(epoch);

  let debugInfo = [
    'Debug Info:',
    'WASD - move | Click - shoot | ',
    entities[0].facing,
    'counter: ' + count,
    'epoch: ' + epoch,
    'score: ' + score,
    'rate: ' + rate,
    'num entities: ' + entities.length,
    'num projectiles: ' + projectiles.length
  ];

  const fontSize = '14';
  c.font = fontSize + 'px serif';



  requestAnimationFrame(animate);
  // wipe screen
	c.clearRect(0, 0, innerWidth, innerHeight);

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
  projectiles.forEach( (i, j, a) => {
    i.update();
    for (let j = 1; j < entities.length; j++) {

      // I need to figure out a better way of doing this
      // or this algo is the only thing that needs the pos data in this way.
      tempPos = {
        x: entities[j].x - entities[j].size/2,
        y: entities[j].y - entities[j].size/2,
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
  let uncolided = entities.filter( isNotString);
  entities = uncolided;
  // if (entities.length <= 2) { init(); } // reset game if there are no zombies
  projectiles = projectiles.filter(isWithinWindow) ;
  
  for (let i = entities.length-1; i >= 0; i--) {
    entities[i].update();
  }
  // entities.forEach( e => {

  // });


  // draw ui
  let ui = 'score: ' + score + '\n' + 'yoyo' + ' ';
  let iWidth = c.measureText(ui).width;
  c.fillText(ui, canvas.width - iWidth -10, 10);

  // draw debug info
  c.fillStyle = '#000000';
  debugInfo.forEach( (i, n) => {
    // let iWidth = c.measureText(i).width;
    c.fillText(i, 5/*canvas.width - iWidth -10*/, (fontSize * n));
  });
  entities[1].update();
  // count is the last thing done in every loop
  count++;
}

// setInterval(function() {
animate();
// }, 1000/1)
