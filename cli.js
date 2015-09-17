#!/usr/bin/env node

var wcag = require('./'),
    getVersion = require('./lib/getVersion'),
    getHelptext = require('./lib/getHelptext'),
    printReport = require('./lib/printReport'),
    log = require('verbalize'),
    argv = require('minimist')(process.argv.slice(2)),
    localtunnel = require('localtunnel'),
    url = require('url'),
    protocolify = require('protocolify'),
    updateNotifier = require('update-notifier');

var uri = argv._[0] || argv.u || argv.uri || argv.url,
    id = argv.id || process.env.ACHECKER_ID,
    guide = argv.guide,
    pkg = require('./package.json'),
    isLocal;

updateNotifier({pkg: pkg}).notify();

if (process.argv.indexOf('-v') !== -1 || process.argv.indexOf('--version') !== -1) {
  console.log(getVersion());
  return;
}

if (process.argv.indexOf('-h') !== -1 || process.argv.indexOf('--help') !== -1) {
  console.log(getHelptext());
  return;
}

if (!uri) {
  log.error('Please provide a URI, either as a first argument or with `-u`');
  process.exit(1);
}

if (!id) {
  log.error('Please provide an AChecker API ID with `--id` or setting an `ACHECKER_ID` environment variable. Register at http://achecker.ca/register.php to get an ID.');
  process.exit(1);
}

uri = protocolify(uri);
isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].indexOf(url.parse(uri).hostname) > -1;

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
  localtunnel(url.parse(uri).port || 8675, function(err, tunnel) {
    if (err) {
      log.error(err);
      process.exit(1);
    }
    validate(tunnel.url + url.parse( uri ).pathname, function() {
      tunnel.close();
    });
  });
} else {
  validate(uri);
}
