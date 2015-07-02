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
  },
  'Abort if provided URI is unreachable': function (test) {
    opts = {
      uri: 'http://achecker.ca/checkacc.php',
      qs: {
        uri: 'thisisnotarealwebsite.foobar',
        output: 'rest',
        guide: 'WCAG2-AA'
      }
    };
    getAcheckerResults(opts, function(err, results) {
      test.ok(err, 'The URI was successfully reached.');
      test.done();
    });
  },
  'Allow HTTPS URIs': function (test) {
    opts = {
      uri: 'http://achecker.ca/checkacc.php',
      qs: {
        uri: 'https://wikipedia.org',
        output: 'rest',
        guide: 'WCAG2-AA'
      }
    };
    getAcheckerResults(opts, function(err, results) {
      test.ok(err === null);
      test.done();
    });
  }
};
