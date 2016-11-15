const AppRootDir = require('app-root-dir').get();
const ContextBuilder = require('./context/context-builder').compose(AppRootDir);
const AppxRequire = require('./appx-require');
const Providers = require('./providers/providers');
const ConfigLoader = require('./config-loader');
const Defroster = require('./type/defroster');
const v310Type = require('./type/v310-type');
const Types = require('./type/types');

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
    const context = ContextBuilder
      .build(resource, additionalContext)
      .forLocal(store);
    return load(name, context);
  };
}

function load(name, context) {
  const module = AppxRequire.require(context);
  if (name) {
    return module[name];
  }
  return module;
}

function registerV310Type(typeName, design, ...aliases) {
  const newType = new v310Type(typeName, design, ...aliases);
  Types.getCacheInstance().register(newType);
  return Handles;
}

function overrideLib(newLib) {
  ContextBuilder.overrideLib(newLib);
  return Handles;
}

const Handles = {
  requireRest: loadRest,
  requireLocal: loadLocal,
  require: (p) => new Defroster().defrostPath(p),
  registerV310Type: registerV310Type,
  overrideLib: overrideLib
};

module.exports = Handles;
