const repl = require("repl");
const ConfigLoader = require('../config-loader');
const Functions = require('./functions');

module.exports = class AppXReplServer {

  constructor() {
    this.appxContext = undefined;
    this.replServer = undefined;
    this.connectionParams = undefined;
    this.scope = {};
  }

  defaultConfig() {
    this.connectionParams = ConfigLoader.readConfig();
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
    if (!this.connectionParams) {
      this.defaultConfig();
    }
    this.replServer = repl.start({
      prompt: 'appx > '
    });
    const functions = Functions(this);
    if (Object.keys(this.scope)) {
      mergeUniqueRight(this.scope, entries, this.replServer.context);
    }
    console.log('merging functions in');
    mergeUniqueRight(functions, fnEntries, this.replServer.context);
  }
};

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

function* fnEntries(obj) {
  for (let key of Object.keys(obj)) {
    if (typeof obj[key] === 'function') {
      console.log(key);
      yield [key, obj[key]];
    }
  }
}

function mergeUniqueRight(source, keyFn, destination) {
  for (let [k,v] of keyFn(source)) {
    destination[k] = source[k];
  }
}

function some(generator, predicate) {
  for (let k of generator()) {
    if (predicate(k)) {
      return true;
    }
  }
  return false;
}
