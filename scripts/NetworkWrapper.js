


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
    Object.entries(actions).forEach( ([key, value]) => { 
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



