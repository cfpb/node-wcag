var request = require('request'),
    fromXml = require('xml2json'),
    getErrorMsg = require('./lib/getErrorMsg');

function generateReport(xml) {
  var report,
      errors = [],
      warnings = [];

  // Strip code tags while preserving any text between them.
  xml = xml.replace(/&lt;code&gt;|&lt;\/code&gt;/ig, '');
  // Strip all decoded HTML entities so the XML parser doesn't explode.
  xml = xml.replace(/&[^\s]*;/ig, '');
  // Remove newlines.
  xml = xml.replace('\n', '');

  report = fromXml.toJson(xml, {object: true, sanitize: false}).resultset;

  report.results.result.forEach(function(result) {
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

  return {
    status: report.summary.status,
    errors: errors,
    potentialProblems: warnings
  };
}

function validate(opts, cb) {
  if (!opts.uri) {
    throw new error('No URI provided to test.');
  }
  if (!opts.id) {
    throw new error('No AChecker API ID provided. Register at http://achecker.ca/register.php to get an ID.');
  }
  opts = {
    uri: 'http://achecker.ca/checkacc.php',
    qs: {
      uri: opts.uri,
      id: opts.id,
      output: 'rest',
      guide: opts.guide || 'WCAG2-AA'
    }
  };
  request(opts, function(err, resp, xml) {
    if (err) return cb(err);
    if (xml.indexOf('Invalid web') > -1) {
      cb('Invalid web service ID. Please get your ID from http://achecker.ca/profile/.')
    }
    var report = generateReport(xml);
    return cb(null, report);
  });
}

module.exports = validate;
