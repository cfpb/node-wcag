// Returns version number from package.json
function getVersion() {
  var pkg = require('../package.json');
  return pkg.version;
}

module.exports = getVersion;
