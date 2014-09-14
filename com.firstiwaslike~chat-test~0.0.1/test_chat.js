require('jslibs/qunit/qunit/qunitContext')(this);

var vertx = require('vertx');
var eb = require('vertx/event_bus');

var FAIL_TIMEOUT = 500;
var SEND_ADDR = 'chat.send';
var CHAT_ADDR = 'chat.public';
var TEST_MESSAGE = { body: "Hello World!", address: CHAT_ADDR };

var fail = function(message) {
  return function() {
    ok(false, message);
    start();
  }
};

QUnit.module('Vert.x-TDD');

test('requiring vertx works in testfile', function() {
  ok(vertx, 'vertx is defined');
});

test('vert.x eventbus can be required', function() {
  ok(eb, 'eventbus is defined');
});

asyncTest('messages send to `'+SEND_ADDR+'` receive a reply', function() {
  eb.send(SEND_ADDR, TEST_MESSAGE, function(reply) {
    ok(true, 'received a reply!');
    vertx.cancelTimer(timerID);
    start();
  });

  var timerID = vertx.setTimer(FAIL_TIMEOUT, fail('messages receive a reply'));
});

asyncTest('messages send to `'+SEND_ADDR+'` get published to `'+CHAT_ADDR+'`', function() {
  var handler = function(msg) {
    deepEqual(msg, TEST_MESSAGE, 'message is published in `'+CHAT_ADDR+'`');
    vertx.cancelTimer(timerID);
    start();
  };

  eb.registerHandler(CHAT_ADDR, handler, function() {
    eb.send(SEND_ADDR, TEST_MESSAGE);
  });

  var timerID = vertx.setTimer(FAIL_TIMEOUT, fail('message gets published'));
});
