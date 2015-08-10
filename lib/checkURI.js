var protocolify = require('protocolify'),
    http = require('http-https'),
    url = require('url');

function check(options, callback) {
  var opts = url.parse(protocolify(options.qs.uri));
  opts.rejectUnauthorized = false;
  http.get(opts, function() {
    callback(null, null);
  }).on('error', function(e) {
    return callback('Unable to connect to ' + e.hostname, null);
  });
}

module.exports = check;
