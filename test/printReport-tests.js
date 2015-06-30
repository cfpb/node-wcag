var log = [];

process.exit = function(){};
function counter() {
  log.push(arguments[0]);
}

var printReport = require('../lib/printReport'),
    fakeAPIResults = require('./fixtures/response');

exports.printReport = {
  setUp: function testSetup(done) {
    printReport(fakeAPIResults, counter);
    done();
  },
  tearDown: function testSetup(done) {
    log = [];
    done();
  },
  'Print correct number of errors': function (test) {
    var i = log.length,
        found = 0;
    while (i--) {
      if (log[i].indexOf('3 errors found') > -1) found++;
    }
    test.ok(found);
    test.done();
  },
  'Print correct number of potential problems': function (test) {
    var i = log.length,
        found = 0;
    while (i--) {
      if (log[i].indexOf('390 potential problems found') > -1) found++;
    }
    test.ok(found);
    test.done();
  },
  'Should not print any errors without locations': function (test) {
    var i = log.length,
        found = 0;
    while (i--) {
      if (log[i].indexOf('Occurs at .') > -1) found++;
    }
    test.equal(found, 0);
    test.done();
  }
};
