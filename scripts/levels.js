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
    levels.push(level[0]);
    let zombies = entities.filter( e => e.hasOwnProperty('zombie'));
    zombies.forEach( e => e.d++ );
  }
}
