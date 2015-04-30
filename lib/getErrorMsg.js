var capitalize = require('capitalize');

// The AChecker XML returns funky error messages. Pull out the useful part.
function getErrorMsg(text) {
  return capitalize(text.match(/target=(.*)/)[1]);
}

module.exports = getErrorMsg;
