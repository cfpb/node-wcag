var http = require('http-https'),
    querystring = require('querystring'),
    async = require('async'),
    checkURI = require('./checkURI');

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
  var body = '';
  var apiUrl = options.uri + '?';
  var url = apiUrl + querystring.stringify(options.qs);

  async.parallel([
      function(cb) {
        checkURI(options, cb);
      },
      function(callback) {
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
    ],
    function finished(err, results) {
      return callback(err, results[1]);
    }
  );

}

module.exports = getAcheckerResults;
