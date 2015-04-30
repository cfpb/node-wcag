#!/usr/bin/env node

var wcag = require('./'),
    log = require('verbalize'),
    argv = require('minimist')(process.argv.slice(2)),
    logSymbols = require('log-symbols'),
    indentString = require('indent-string'),
    localtunnel = require('localtunnel'),
    url = require('url'),
    updateNotifier = require('update-notifier');

var uri = argv._[0] || argv.u || argv.uri || argv.url,
    id = argv.id || process.env.ACHECKER_ID,
    guide = argv.guide,
    pkg = require('./package.json'),
    isLocal;

updateNotifier({pkg: pkg}).notify();

if (!uri) {
  log.error('Please provide a URI, either as a first argument or with `-u`');
  process.exit(1);
}

if (!id) {
  log.error('Please provide an AChecker API ID with `--id` or setting an `ACHECKER_ID` environment variable. Register at http://achecker.ca/register.php to get an ID.');
  process.exit(1);
}

isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(url.parse(uri).hostname) > -1;

function printLn(string) {
  return console.log(indentString(string, ' ', 2));
}

function printReport(report) {
  printLn('');
  if (!report.errors.length) {
    printLn(logSymbols.success + '  No errors found!');
  } else {
    printLn(logSymbols.error + '  ' + report.errors.length + ' errors found.\n');
    report.errors.forEach(function(error) {
      printLn(logSymbols.error + '  ' + error.line + ':' + error.column + ' '  + error.message);
    });
    printLn('');
  }
  if (report.potentialProblems.length) {
    printLn(logSymbols.warning + '  ' + report.potentialProblems.length + ' potential problems found.\n');
    report.potentialProblems.forEach(function(warning) {
      printLn(logSymbols.warning + '  ' + warning.line + ':' + warning.column + ' '  + warning.message);
    });
    printLn('');
  }
}

function validate(uri, cb) {
  var opts = {
    uri: uri,
    id: id,
    guide: guide
  };
  wcag(opts, function(err, report) {
    if (err) {
      log.error(err);
      process.exit(1);
    }
    printReport(report);
    if (cb) cb();
  });
}

if (isLocal) {
  return localtunnel(url.parse(uri).port || 8675, function(err, tunnel) {
    if (err) {
      log.error(err);
      process.exit(1);
    }
    validate(tunnel.url, function() {
      tunnel.close();
    })
  });
}

validate(uri);
