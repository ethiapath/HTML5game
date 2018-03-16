

class NetworkWrapper {
  
  constructor() {

    

  }
  eventHandler(eventType) {
    if (event !== 'undefined') {
      this.[eventType] = event;
    } else if (this.[eventType] !== 'undefined') {
      this.[eventType](data);
    } else {
      console.log(
        'No event for ' 
        + eventType 
        + 'has been defined');
    }
  }
  send(data, event) {

  }

}

NetworkWrapper.prototype.recive = () => 'the is a function';