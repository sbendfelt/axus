const repl = require("repl");
const ConfigLoader = require('../config-loader.js');

class AppXReplServer {

  constructor(appxContext, replServer) {
    this.appxContext = appxContext;
    this.replServer = replServer;
  }
}

class AppXReplServerBuilder {

  constructor() {
    this.appxContext = null;
    this.connectionConf = null;
    this.scope = {};
  }

  defaultConfig() {
    this.config = ConfigLoader.readConfig();
    return this;
  }

  withConfiguration() {
    throw new Error('not implemented');
  }

  //TODO: is this confusing? should this come from
  // the appxcontext?
  withProviders(providers) {
    addScope('Providers', providers);
    return this;
  }

  addScope(scope) {
    if (keysClash(scope)) {
      throw new Error('New scope clashes');
    }
    Object.assign(this.scope, scope);
    return this;
  }

  start() {
    const replServer = repl.start({
      prompt: 'appx > '
    });
    if(Object.keys(this.scope)) {
      mergeUniqueRight(this.scope, replServer.context);
    }
    return new AppXReplServer();
  }

}

function keysClash() {
  var scopes = Aray.prototype.slice.call(arguments);
  if (!scopes.length) {
    return false;
  }
  if (scopes.length === 1) {
    scopes.push(this.scope);
  } else if (scopes.length > 2) {
    throw new Error('Only two scopes may be compared');
  }
  return some(entries, entry => {
    [key, value] = entry;
    return scope[1][key];
  });
}

function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

function mergeUniqueRight(source, destination) {
  for(let k of entries(source)) {
    destination[k] = source[k];
  }
}

function some(generator, predicate) {
  for(let k of generator()) {
    if(predicate(k)) {
      return true;
    }
  }
  return false;
}

module.exports = {
  Builder: AppXReplServerBuilder,
  Server: AppXReplServer,
};
