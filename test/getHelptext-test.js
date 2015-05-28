var getHelptext = require('../lib/getHelptext');
var helpText = require('../lib/helptext.json').join('\n');

exports.getHelptext = {
  setUp: function testSetup(done) {
    done();
  },
  'Returns correct helptext': function testHelptext(test) {
    test.equal(helpText, getHelptext());
    test.done();
  }
};
