'use strict';

var wcag = process.env.WCAG_COVERAGE ? require('../index-cov.js') : require('../index.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

function hasKey(test) {
  if (!process.env.ACHECKER_ID) {
    test.ok(false, 'You need to set an ACHECKER_ID environment variable. Get your ID from http://achecker.ca/profile/.');
    test.done();
    return false;
  }
  return true;
}

exports.wcag = {
  setUp: function(done) {
    // setup here
    done();
  },
  'Missing arguments': function(test) {
    test.throws(wcag());
    test.throws(wcag({pizza: 'party'}));
    test.done();
  },
  'Bad arguments': function(test) {
    test.throws(wcag({uri: 'http://pizzaparty.biz'}));
    test.done();
  },
  'Bad API key': function(test) {
    test.expect(1);
    wcag({uri: 'http://pizzaparty.biz', id: 'blarg'}, function(err) {
      test.throws(err);
      test.done();
    });
  },
  'Correctly gets WCAG errors for example.com': function(test) {
    test.expect(1);
    if (!hasKey(test)) return;
    wcag({uri: 'http://example.com', id: process.env.ACHECKER_ID}, function(err, resp) {
      test.equal(resp.errors.length, 2);
      test.done();
    });
  },
  'Correctly gets WCAG potential problems for example.com': function(test) {
    test.expect(1);
    if (!hasKey(test)) return;
    wcag({uri: 'http://example.com', id: process.env.ACHECKER_ID}, function(err, resp) {
      test.equal(resp.potentialProblems.length, 13);
      test.done();
    });
  },
  'Correctly gets 508 errors for example.com': function(test) {
    test.expect(1);
    if (!hasKey(test)) return;
    wcag({uri: 'http://example.com', id: process.env.ACHECKER_ID, guide: 508}, function(err, resp) {
      test.equal(resp.errors.length, 0);
      test.done();
    });
  },
  'Correctly gets 508 potential problems for example.com': function(test) {
    test.expect(1);
    if (!hasKey(test)) return;
    wcag({uri: 'http://example.com', id: process.env.ACHECKER_ID, guide: 508}, function(err, resp) {
      test.equal(resp.potentialProblems.length, 1);
      test.done();
    });
  }
};
