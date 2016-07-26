const LibImport = require('./import/library-importer');
const AppxRequire = (function(module, undefined) {
  "use strict";
  let vm, instance;

  vm = require('vm');

  function load(name, context, callback) {
    const {code, sandbox} = context;
    vm.runInNewContext(code, sandbox, 'appx-module'); //TODO get module name
    return sandbox;
  }

  instance = {
    require: load
  };

  return instance;
}());

module.exports = AppxRequire;
