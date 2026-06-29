const { EventEmitter } = require("events");

class EventBus extends EventEmitter {
  emit(event, payload) {
    console.log("[event]", event, JSON.stringify(payload));
    return super.emit(event, payload);
  }
}

const bus = new EventBus();

module.exports = { bus };
