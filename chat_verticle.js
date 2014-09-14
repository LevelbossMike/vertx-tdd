var vertx = require('vertx');
var eb = vertx.eventBus;

var SEND_ADDRESS = 'chat.send';

var handler = function(message, replier) {
  replier('ok');
  eb.publish(message.address, message);
};

eb.registerHandler(SEND_ADDRESS, handler);
