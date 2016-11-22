const repl = require('repl');
const ConfigLoader = require('../config-loader');
const Functions = require('./functions');
const LoadModuleCommand = require('./command/load-module');
const WriteVariable = require('./command/write-variable');
const Providers = require('../providers/providers');
const ReplEval = require('./repl-eval');
const sync = require('synchronize');

module.exports = class AppXReplServer {

  constructor() {
    this.appxContext = undefined;
    this.replServer = undefined;
    this.connectionParams = undefined;
    this.functions = Functions(this);
    this.scope = {};
    this.isStarted = false;
  }

  useDefaultConfig() {
    this.connectionParams = ConfigLoader.readConfig();
    return this;
  }

  useConfig() {
    throw new Error('not implemented');
  }

  //TODO: is this confusing? should this come from
  // the appxcontext?
  useProviders(providers) {
    this.bridge = providers.bridge;
    this.addScope({Providers: providers});
    return this;
  }

  useDefaultProviders() {
    if(!this.connectionParams) {
      throw new Error('Please specify config');
    }
    const providers = Providers.rest.seed(this.connectionParams);
    this.bridge = providers.bridge;
    this.addScope({Providers: providers});
    return this;
  }

  addScope(scope) {
    if (keysClash.call(this, scope)) {
      throw new Error('New scope clashes');
    }
    return this.putScope(scope);
  }

  putAppXScope(scope, digests) {
    this.putScope(scope);
    //TODO: register digests
    // Bridge only has room for one digest now. Wah :(
  }

  putScope(scope) {
    Object.assign(this.scope, scope);
    if(this.isStarted) {
      this.injectContext();
    }
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
    this.replServer.defineCommand('loadModule', LoadModuleCommand(this));
    this.replServer.defineCommand('writeVariable', WriteVariable(this));
    this.isStarted = true;
    this.injectContext();
    return this;
  }

  injectContext() {
    if(!this.isStarted) {
      throw new Error('Cannot inject context to repl until repl is started');
    }
    if (Object.keys(this.scope)) {
      mergeUniqueRight(this.scope, entries, this.replServer.context);
    }
    mergeUniqueRight(this.functions, fnEntries, this.replServer.context);
    this.replServer.context.sync = sync;
    return this;
  }

  getReplContext() {
    return this.replServer.context;
  }

  getFromContext(name) {
    return this.replServer.context[name];
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
