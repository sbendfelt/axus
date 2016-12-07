const ConfigLoader = require('../config-loader');
const ConnectionManagerCommand = require('./command/connection-manager');
const ContextBuilder = require('../context/context-builder');
const HelpCommand = require('./command/help-command');
const HelpRegistrar = require('./help/help-registrar');
const LoadModuleCommand = require('./command/load-module');
const Providers = require('../providers/providers');
const ReplEval = require('./repl-eval');
const WriteVariableCommand = require('./command/write-variable');

const repl = require('repl');
const sync = require('synchronize');

const chalk = require('chalk');

const preamble = chalk.yellow(
`axus /ˈaksəs/
noun.
  1. a REPL for the AppXpress API.
  2. a unit test harness for AppXpress Modules.

developer.gtnexus.com
`);

module.exports = class AppXReplServer {

  constructor() {
    this.appxContext = undefined;
    this.bridge = undefined;
    this.replServer = undefined;
    this.connectionParams = undefined;
    this.scope = {};
    this.isStarted = false;
  }

  useDefaultConfig() {
    this.connectionParams = ConfigLoader.readConfig();
    return this;
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
    //push digests onto bridge.
  }

  putScope(scope) {
    Object.assign(this.scope, scope);
    if(this.isStarted) {
      this.injectContext();
    }
    return this;
  }

  start() {
    HelpRegistrar.processDeferrals();
    console.log(preamble);
    if (!this.connectionParams) {
      this.useDefaultConfig();
    }
    const appxContext = new ContextBuilder()
      .useRest(this.connectionParams)
      .build();
    this.bridge = appxContext.createBridge();
    const {sandbox} = appxContext.produceRunTime();
    this.putScope(sandbox);
    this.replServer = repl.start({
      prompt: chalk.green('appx > '),
      eval: makeEval(this)
    });
    standardCommands.call(this);
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
    this.replServer.context.sync = sync;
    return this;
  }

  getReplContext() {
    return this.replServer.context;
  }

  getFromContext(name) {
    return this.replServer.context[name];
  }

  updateCredentials(newCredentials) {
    if(!this.isStarted) {
      throw new Error('Must start repl before changing credentials');
    }
    this.connectionParams = newCredentials;
    this.bridge.changeCredentials(newCredentials);
  }

};

function standardCommands() {
  this.replServer.defineCommand('loadModule', LoadModuleCommand(this));
  this.replServer.defineCommand('writeVariable', WriteVariableCommand(this));
  this.replServer.defineCommand('connection', ConnectionManagerCommand(this));
  this.replServer.defineCommand('h', HelpCommand(this));
}

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
