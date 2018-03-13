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