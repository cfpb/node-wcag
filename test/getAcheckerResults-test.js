var getAcheckerResults = require('../lib/getAcheckerResults');

exports.getAcheckerResults = {
  setUp: function testSetup(done) {
    done();
  },
  'Missing argument: options': function (test) {
    getAcheckerResults(false, function(err) {
      test.throws(err);
      test.done();
    });
  },
  'Missing argument: options.uri': function (test) {
    getAcheckerResults({'uri': false}, function(err) {
      test.throws(err);
      test.done();
    });
  },
  'Missing argument: options.ws': function (test) {
    getAcheckerResults({'uri': true, 'qs': false}, function(err) {
      test.throws(err);
      test.done();
    });
  }
};
