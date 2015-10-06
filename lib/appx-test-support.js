
var appRootDir = require('app-root-dir').get();
console.log('>> app-root: ' + appRootDir);
let appxRequire = require('./appx-require').compose(appRootDir);
let Providers = require('./providers/providers');
let configLoader = require('./config-loader');

let loadRest = (resource, name, additionalContext) => {
  let conf = configLoader.readConfig();
  let ctx = {};
  Object.assign(ctx, {
    Providers: Providers.rest.seed(conf)
  }, additionalContext || {});
  return load(resource, name, ctx);
};

let loadLocal = (resource, name, additionalContext, store) => {
  store = store || {};
  if (typeof store !== 'object') {
    throw new TypeError('Store must be an object!');
  }
  let ctx = {};
  Object.assign(ctx, {
    Providers: Providers.local.seed(store)
  }, additionalContext || {});
  return load(resource, name, ctx);
};

let load = (resource, name, completeContext) => {
  let module = appxRequire.require(resource, completeContext);
  if (name) {
    return module[name];
  }
  return module;
};

module.exports = {
  requireRest: loadRest,
  requireLocal: loadLocal
};
