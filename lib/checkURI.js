var protocolify = require('protocolify'),
    http = require('http-https');

function check(options, callback) {
  http.get(protocolify(options.qs.uri), function() {
    callback(null, null);
  }).on('error', function(e) {
    return callback('Unable to connect to ' + e.hostname, null);
  });
}

module.exports = check;
