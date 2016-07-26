let LibImport = require('./import/lib-import');
let appxRequire = (function(module, undefined) {
  "use strict";
  let vm, instance;

  vm = require('vm');

  function load(name, contextBuilder, callback) {
    // Get Module Name from context.Providers.getModuleDesignConfiguration().getModuleName();
    let uniScript = contextBuilder.uniScript;
    let context = contextBuilder.context;
    vm.runInNewContext(uniScript, context, 'appx-module'); //TODO get module name
    return context;
  }

  instance = {
    require: load
  };

  return instance;
}());

module.exports = appxRequire;
