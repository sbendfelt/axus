var size = require('window-size');
var chalk = require('chalk');

var prettyPrint = (function() {
  function repeat(arg, chalkFn) {
    var toPrint = makeStr(size.width, arg).substring(0, size.width);
    if (chalkFn) {
      toPrint = chalkFn.call(this, toPrint);
    }
    return toPrint;
  }

  function centered(arg, chalkFn) {
    var filler = makeStr(size.width - arg.length, ' ');
    var mid = (size.width - arg.length) / 2;
    var xs = [filler.substring(0, mid), filler.substring(mid)];
    var toPrint = xs[0] + arg + xs[1];
    if (chalkFn) {
      toPrint = chalkFn.call(this, toPrint);
    }
    return toPrint;
  }

  function makeStr(len, char) {
    return Array.prototype.join.call({
      length: (len || -1) + 1
    }, char || 'x');
  }

  return {
    centered: centered,
    repeat: repeat
  };
}());

module.exports = prettyPrint;
