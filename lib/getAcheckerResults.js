function getAcheckerResults(options, callback) {
  if (!options) {
    return callback(new Error('Missing required input options'));
  }
  if (!options.uri) {
    return callback(new Error('Missing required input options.uri'));
  }
  if (!options.qs) {
    return callback(new Error('Missing required input options'));
  }
  var http = require('http');
  var querystring = require('querystring');
  var body = '';
  var apiUrl = options.uri + '?';
  var url = apiUrl + querystring.stringify(options.qs);

  http.get(url, function(response) {

    response.on('data', function(chunk) {
      body += chunk.toString();
    });

    response.on('end', function() {
      return callback(null, body);
    });

  }).on('error', function(error) {
    return callback(error, null);
  });

}

module.exports = getAcheckerResults;