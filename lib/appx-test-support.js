var appRootDir = require('app-root-dir').get();
let appxRequire = require('./appx-require').compose(appRootDir);
let Providers = require('./providers/providers');
let configLoader = require('./config-loader');

let _ProvidersInstance;

let loadRest = (resource, name, additionalContext) => {
  let conf = configLoader.readConfig();
  let ctx = {};
  _ProvidersInstance = Providers.rest.seed(conf);
  Object.assign(ctx, {
    Providers: _ProvidersInstance
  }, additionalContext || {});
  return load(resource, name, ctx);
};

let loadLocal = (resource, name, additionalContext) => {
  return {
    seed: function seed(store) {
      store = store || {};
      if (typeof store !== 'object') {
        throw new TypeError('Store must be an object!');
      }
      let ctx = {};
      _ProvidersInstance = Providers.local.seed(store);
      Object.assign(ctx, {
        Providers: _ProvidersInstance
      }, additionalContext || {});
      return load(resource, name, ctx);
    }
  };
};

let load = (resource, name, completeContext) => {
  let module = appxRequire.require(resource, completeContext);
  if (name) {
    return module[name];
  }
  return module;
};

let handles = {
  requireRest: loadRest,
  requireLocal: loadLocal
};
handles.overrideLib = (newLib) => {
  appxRequire.overrideLib(newLib);
  return handles;
};

module.exports = handles;
