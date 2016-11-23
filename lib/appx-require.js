const AppxRequire = (function() {
  "use strict";

  const vm = require('vm');

  function _require(context) {
    const {code, sandbox} = context.produceRunTime();
    vm.runInNewContext(code, sandbox, 'appx-module'); //TODO get module name
    return sandbox;
  }

  return {
    require: _require
  };
}());

module.exports = AppxRequire;
