'use strict';

var parseString = require('xml2js').parseString;
var protocolify = require('protocolify');
var validUrl = require('valid-url');
var getAcheckerResults = require('./lib/getAcheckerResults');
var ignoreList = require('./lib/ignore.json');
var getErrorMsg = require('./lib/getErrorMsg');

function ignoreIt(result) {
  if (!result.errorMsg ||
      ignoreList.indexOf(getErrorMsg(result.errorMsg)) > -1) {
    return true;
  }
  return false;
}

function formatReport(status, errors, warnings) {
  return {
    status: status,
    errors: errors,
    potentialProblems: warnings
  };
}

function generateReport(xml, callback) {

  var report,
      results,
      errors = [],
      warnings = [],
      failedParsing = false;

  // Strip code tags while preserving any text between them.
  xml = xml.replace(/&lt;code&gt;|&lt;\/code&gt;/ig, '');
  // Strip all decoded HTML entities so the XML parser doesn't explode.
  xml = xml.replace(/&[^\s]*;/ig, '');
  // Remove newlines.
  xml = xml.replace('\n', '');


  parseString(xml, {explicitArray: false}, function(err, data) {
    if (err) {
      failedParsing = err;
    } else {
      report = data.resultset;

      if (!report.results.result) {
        return callback(null,
                        formatReport(report.summary.status, errors, warnings));
      }

      results = report.results.result instanceof Array ?
        report.results.result :
        [report.results.result];

      results.forEach(function(result) {
        if (ignoreIt(result)) return;
        if (result.resultType === 'Error') {
          errors.push({
            line: result.lineNum,
            column: result.columnNum,
            message: getErrorMsg(result.errorMsg),
            solution: result.repair
          });
        }
        if (result.resultType === 'Potential Problem') {
          warnings.push({
            line: result.lineNum,
            column: result.columnNum,
            message: getErrorMsg(result.errorMsg),
            source: result.errorSourceCode
          });
        }
      });
    }
    return failedParsing ?
      callback(failedParsing, null) :
      callback(null, formatReport(report.summary.status, errors, warnings));
  });
}

function validate(opts, cb) {
  opts = opts || {};
  cb = cb || function() {};
  var msg;
  if (!opts.uri) {
    return cb(new Error('No URI provided to test.'));
  }
  if (opts.uri && !validUrl.isWebUri(opts.uri)) {
    return cb(new Error('You supplied an invalid URL.'), null);
  }
  if (!opts.id) {
    msg = 'No AChecker API ID provided. ' +
          'Register at http://achecker.ca/register.php to get an ID.';
    return cb(new Error(msg));
  }
  opts = {
    uri: 'https://achecker.ca/checkacc.php',
    qs: {
      uri: protocolify(opts.uri),
      id: opts.id,
      output: 'rest',
      guide: opts.guide || 'WCAG2-AA'
    }
  };
  getAcheckerResults(opts, function(err, xml) {
    if (err) return cb(new Error(err));
    if (xml.indexOf('Invalid web service ID') > -1) {
      msg = 'Invalid web service ID. ' +
            'Please get your ID from http://achecker.ca/profile/.';
      return cb(new Error(msg));
    }
    generateReport(xml, function(error, report) {
      return error ?
        cb(error, null) :
        cb(null, report);
    });

  });
}

module.exports = validate;
