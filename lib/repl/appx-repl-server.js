const repl = require("repl");
const ConfigLoader = require('../config-loader');
const Functions = require('./functions');
const Providers = require('../providers/providers');
const ReplEval = require('./repl-eval');


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
    this.addScope({Providers: providers});
    return this;
  }

  withDefaultProviders() {
    if(!this.connectionParams) {
      throw new Error('Please specify config');
    }
    const providers = Providers.rest.seed(this.connectionParams);
    this.addScope({Providers: providers});
    return this;
  }

  addScope(scope) {
    if (keysClash.call(this, scope)) {
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
      prompt: 'appx > ',
      eval: makeEval(this)
    });
    const functions = Functions(this);
    if (Object.keys(this.scope)) {
      mergeUniqueRight(this.scope, entries, this.replServer.context);
    }
    mergeUniqueRight(functions, fnEntries, this.replServer.context);

  }

  getReplContext() {
    return this.replServer.context;
  }
};

function keysClash(...scopes) {
  if (!scopes.length) {
    return false;
  }

  if (scopes.length === 1) {
    scopes.push(this.scope);
  } else if (scopes.length > 2) {
    throw new Error('Only two scopes may be compared');
  }



  return some(entries(scopes[0]), entry => {
    [key, value] = entry;
    return scopes[1][key];
  });
}

function makeEval(options) {

  return ReplEval.createEval(options);
}

function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

function* fnEntries(obj) {
  for (let key of Object.keys(obj)) {
    if (typeof obj[key] === 'function') {
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
  for (let k of generator) {
    if (predicate(k)) {
      return true;
    }
  }
  return false;
}
