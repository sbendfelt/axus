var appRootDir = require('app-root-dir').get();
let contextBuilder = require('./context-builder').compose(appRootDir);
let appxRequire = require('./appx-require');
let Providers = require('./providers/providers');
let configLoader = require('./config-loader');

let _ProvidersInstance;

let loadRest = (resource, name, additionalContext) => {
  let conf = configLoader.readConfig();
  let contextBuilder = build(resource, additionalContext).forRest(conf);
  return load(name, contextBuilder);
};

let loadLocal = (resource, name, additionalContext) => {
  return {
    seed: function seed(store) {
      store = store || {};
      if (typeof store !== 'object') {
        throw new TypeError('Store must be an object!');
      }
      let contextBuilder = build(resource, additionalContext).forLocal(store);
      return load(name, contextBuilder);
    }
  };
};

let build = (resource, additionalContext) => {
  return contextBuilder.build(resource, additionalContext);
};

let load = (name, contextBuilder) => {
  let module = appxRequire.require(name, contextBuilder);
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
  contextBuilder.overrideLib(newLib);
  return handles;
};

module.exports = handles;
