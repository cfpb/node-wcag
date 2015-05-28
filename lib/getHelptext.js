// Returns helptext
function getHelptext() {
  var help = require('./helptext.json');
  return help.join('\n');
}

module.exports = getHelptext;
