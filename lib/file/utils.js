const path = require('path');
const home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

function expand(p) {
  if(!p) {
    return p;
  }
  if(p === '~') {
    return home;
  }
  if(p.substr(0,2) !== '~/') {
    return p;
  }
  return path.join(home, p.substr(2));
}

exports.expand = expand;
