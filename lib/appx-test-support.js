const AppRootDir = require('app-root-dir').get();
const ContextBuilder = require('./context-builder').compose(AppRootDir);
const AppxRequire = require('./appx-require');
const Providers = require('./providers/providers');
const ConfigLoader = require('./config-loader');

function loadRest(resource, name, additionalContext) {
  const conf = ConfigLoader.readConfig(); //TODO: rename configloader is pretty generic.
  const context = ContextBuilder
    .build(resource, additionalContext)
    .forRest(conf);
  return load(name, context);
}

function loadLocal(resource, name, additionalContext) {
  return {
    seed: seedFunction(resource, name, additionalContext)
  };
}

function seedFunction(resource, name, additionalContext) {
  return function seed(store) {
    store = store || {};
    if (typeof store !== 'object') {
      throw new TypeError('Store must be an object!');
    }
    let context = ContextBuilder
      .build(resource, additionalContext)
      .forLocal(store);
    return load(name, context);
  };
}

function load(name, context) {
  let module = AppxRequire.require(name, context);
  if (name) {
    return module[name];
  }
  return module;
}

const handles = {
  requireRest: loadRest,
  requireLocal: loadLocal
};
handles.overrideLib = (newLib) => {
  ContextBuilder.overrideLib(newLib);
  return handles;
};

module.exports = handles;
