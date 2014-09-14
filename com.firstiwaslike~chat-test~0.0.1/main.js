var container = require('vertx/container');
var runTests = require('jslibs/qunit/vertxTestRnr');

runTests(
  function () {
    container.exit();
  }
);
