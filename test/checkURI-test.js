var checkURI = require('../lib/checkURI');

exports.getVersion = {
  setUp: function testSetup(done) {
    done();
  },
  'Throws with bad URI': function testVersion(test) {
    var opts = {
      uri: 'http://achecker.ca/checkacc.php',
      qs: {
        uri: 'https://notarealwebsite.foobar',
        output: 'rest',
        guide: 'WCAG2-AA'
      }
    };
    checkURI(opts, function(err, results) {
      test.ok(err !== null);
      test.done();
    });
  },
  'A-OK with good URI': function testVersion(test) {
    var opts = {
      uri: 'http://achecker.ca/checkacc.php',
      qs: {
        uri: 'https://hotmail.com',
        output: 'rest',
        guide: 'WCAG2-AA'
      }
    };
    checkURI(opts, function(err, results) {
      test.ok(err === null);
      test.done();
    });
  },
  'Doesn\'t throw when SSL cert is bad': function testVersion(test) {
    // mrfylke.no may someday fix their cert which would cause this test to no
    // longer be accurate. I'm unsure how to fake this problem without standing
    // up a server with a bad cert.
    var opts = {
      uri: 'http://achecker.ca/checkacc.php',
      qs: {
        uri: 'https://www.mrfylke.no/',
        output: 'rest',
        guide: 'WCAG2-AA'
      }
    };
    checkURI(opts, function(err, results) {
      test.ok(err === null);
      test.done();
    });
  }
};
