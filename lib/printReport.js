var groupMessages = require('./groupMessages'),
    logSymbols = require('log-symbols'),
    indentString = require('indent-string');

function printLocations(locations) {
  var msg = locations.splice(0, 10).join(', ');
  msg += locations.length ? ' plus ' + locations.length + ' other locations.' : '.';
  return msg;
}

function printReport(report, reporter) {
  var msgs,
      msg,
      additional;

  function printLn(string) {
    reporter = reporter || console.log;
    return reporter(indentString(string, ' ', 2));
  }

  printLn('');

  // Deal with errors.
  if (!report.errors.length) {
    printLn(logSymbols.success + '  No accessibility problems found!');
  } else {
    msgs = groupMessages(report.errors);
    printLn(logSymbols.error + '  ' + report.errors.length + ' errors found.\n');
    for (msg in msgs) {
      printLn(logSymbols.error + '  ' + msg + ' Occurs at ' + printLocations(msgs[msg]));
    }
    printLn('');
  }

  // Deal with potential problems.
  if (report.potentialProblems.length) {
    msgs = groupMessages(report.potentialProblems);
    printLn(logSymbols.warning + '  ' + report.potentialProblems.length + ' potential problems found.\n');
    for (msg in msgs) {
      printLn(logSymbols.warning + '  ' + msg + ' Occurs at ' + printLocations(msgs[msg]));
    }
    printLn('');
  }

  // Return non-zero if there are errors.
  if (report.errors.length) process.exit(1);
}

module.exports = printReport;
