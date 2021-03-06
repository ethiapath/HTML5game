

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
// will replace with objects
var entities = [];
/* potential replacement (will require refactor)
var entities = {
  enemys: []/{},
  players: {}, // important design decision that will enable multiplayer down the line
  projectiles: [] // because why not. the collision code will have to get more complex down the line 
  to handle different players being collided with. 
}
var projectiles = [];
*/
