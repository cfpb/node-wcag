var groupMessages = require('../lib/groupMessages'),
    fakeAPIResults = require('./fixtures/response');

exports.printReport = {
  setUp: function testSetup(done) {
    done();
  },
  'Group errors': function (test) {
    var errors = groupMessages(fakeAPIResults.errors);
    test.equal(errors['Id attribute is not unique.'].length, 1);
    test.equal(errors['The contrast between the colour of selected link text and its background is not sufficient to meet WCAG2.0 Level AA.'].length, 2);
    test.done();
  },
  'Group potential problems': function (test) {
    var probs = groupMessages(fakeAPIResults.potentialProblems);
    test.equal(probs['Site missing site map.'].length, 1);
    test.equal(probs['H5 may be used for formatting.'].length, 33);
    test.done();
  }
};
