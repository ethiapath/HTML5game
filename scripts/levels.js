



let levels = [
  {
    goal: () => {
      return score > 100;
    },
    update: () => {
      entities.push(new Zombie( (innerWidth * Math.random()), 0));
      // goal
      if (score > 100) { epoch++; }
    }
  },
  {
    goal: () => score > 500,
    update: () => {
      if (!(count % 120) && rate !== 1) { rate--; }
      
      // if (!(score % 10)) { rate /= 2;}
      if (entities.length < 1000 && !(count % rate)) {
        entities.push(new Zombie( (innerWidth * Math.random()), innerHeight));
        entities.push(new Zombie( innerWidth, (innerHeight * Math.random())));
        entities.push(new Zombie( 0, (innerHeight * Math.random())));
        entities.push(new Zombie( (innerWidth * Math.random()), 0));
      }
      if ( this.goal ) { epoch++; }
    }
  },
  {
    hasRun: false,
    init: () => {
      // zombies get faster
      let zombies = entities.filter( e => e.hasOwnProperty('zombie'));
      zombies.forEach( e => e.d++ );
    },
    update: () => {
      entities.push(new Zombie( (innerWidth * Math.random()), innerHeight));
      // goal
      // if (score > 100) { epoch++; }
    }  
  }
]
let currentLevel = 'some shit';
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




