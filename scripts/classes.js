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

class Player extends Entity {
  constructor(x, y) {
    super(x,y);
    this.size = 50;
    this.d = 7;
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
      this.buttons.forIn( (k, o) => {
        if(event.keyCode === o[k].value) {
          o[k].state = true;
        }
      });
    });
    // recheck button state from keyup event
    document.addEventListener('keyup', event => {
      this.buttons.forIn( (k, o) => {
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
    sayStuff([
      epoch,
    ],
    {
      x: this.x + this.size/2,
      y: this.y + this.size/2
    });
  }

  // update player state from buttons state
  moving() {
    this.buttons.forIn( (direction) => {
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
    c.fillRect((this.x - this.size/2), (this.y - this.size/2), this.size, this.size);
  }
  
  update() {
    let playerPos = {
      x: entities[0].x, 
      y: entities[0].y
    };
    
    let pos = moveOneRadTowardsTarget(this.x, this.y, playerPos.x, playerPos.y, this.d);
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
  sayStuff([score], {x: this.x + 10, y: this.y + 10}, '#ff0000');
  }
    this.update = function() {
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
    this.target = {x: entities[1].x, y: entities[1].y};
    this.isBackwards = (this.x > this.target.x && this.y < this.target.y || this.x > this.target.x && this.y > this.target.y);
    this.angle = facingAngle(entities[1].x, entities[1].y, entities[0].x, entities[0].y);

  }
  draw() {
    c.fillStyle = this.color;
    c.fillRect((this.x - this.size/2), (this.y - this.size/2), this.size, this.size);
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
    this.draw();
  }
}
document.addEventListener('click', (event) => {
  projectiles.push(new Bullet(entities[0].x, entities[0].y));
  console.log('clicked!')
})