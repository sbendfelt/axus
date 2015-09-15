var companion = require('companion').compose(module.parent.filename);
var Providers = require('./providers/providers');

var loadRest = (resource, name, additionalContext) => {
  var ctx = {};
  Object.assign(ctx, {
    Providers: Providers.rest
  }, additionalContext || {});
  return load(resource, name, ctx);
};

var loadLocal = (resource, name, additionalContext, store) => {
  store = store || {};
  if(typeof store !== 'object') {
    throw new TypeError('Store must be an object!');
  }
  var ctx = {};
  Object.assign(ctx, {
    Providers: Providers.local.seed(store)
  }, additionalContext || {});
  return load(resource, name, ctx);
};

var load = (resource, name, completeContext) => {
  var module = companion.require(resource, completeContext);
  if (name) {
    return module[name];
  }
  return module;
};

module.exports = {
  requireRest: loadRest,
  requireLocal: loadLocal
};
