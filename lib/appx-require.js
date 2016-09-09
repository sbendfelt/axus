const AppxRequire = (function(module, undefined) {
  "use strict";
  let vm, instance;

  vm = require('vm');

  function _require(context) {
    const {code, sandbox} = context;
    vm.runInNewContext(code, sandbox, 'appx-module'); //TODO get module name
    return sandbox;
  }

  return {
    require: _require
  };
}());

module.exports = AppxRequire;
