// global vars
let score = 0;
const countStart = 500;
let epoch = 0;
let count = 0;
let rate = 120;

var entities = [];

var projectiles = [];

var startPos = {
  x: window.innerWidth/2,
  y: window.innerHeight/2
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
// and the stuff being drawn don't have to be happening at the same time.




function animateLoop() {  
  // wipe screen
  c.clearRect(0, 0, innerWidth, innerHeight);
  entities.forEach( e => { e.draw(); } );
  projectiles.forEach( e => { e.draw(); });
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

  // count is the last thing done in every loop
  count++;
}

function debugStuff() {
  c.fillStyle = '#000000';
  let debugInfo = [
    'Debug Info:',
    'WASD - move | Click - shoot | ',
    entities[0].facing,
    'game counter: ' + count,
    'animate counter: ' + numAnimationFrames,
    'sync: ' + (count > numAnimationFrames ? 'game ahead':'lag'),
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