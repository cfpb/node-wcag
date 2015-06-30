function group(msgs) {
  var groupedMsgs = {};
  msgs.forEach(function(msg) {
    if (groupedMsgs[msg.message]) {
      groupedMsgs[msg.message].push(msg.line + ':' + msg.column);
    } else {
      groupedMsgs[msg.message] = [msg.line + ':' + msg.column];
    }
  });
  return groupedMsgs;
}

module.exports = group;
