let MessageProvider = require('./messageProvider.js');
let ObjectFactoryProvider = require('./objectFactoryProvider.js');
let PersistenceProvider = require('./persistenceProvider.js');
let QueryProvider = require('./queryProvider.js');

let seed;

let getMessageProvider = function getMessageProvider() {
  return MessageProvider.getInstance();
};

let getObjectFactoryProvider = function getObjectFactoryProvider() {
  return ObjectFactoryProvider.getInstance();
};

let getPersistenceProvider = function getPersistenceProvider() {
  return PersistenceProvider.getInstance();
};

let getQueryProvider = function getQueryProvider() {
  return QueryProvider.getInstance(seed);
};

let handles = {
  getQueryProvider: getQueryProvider,
  getPersistenceProvider: getPersistenceProvider,
  getMessageProvider: getMessageProvider,
  getObjectFactoryProvider: getObjectFactoryProvider,
  reset: () => {
    getQueryProvider().reset();
    getMessageProvider().reset();
    getObjectFactoryProvider().reset();
    getPersistenceProvider().reset();
  }
};

module.exports = {
  local: {
    seed: (store) => {
      seed = {
        'local': store
      };
      return handles;
    }
  },
  rest: {
    seed: (config) => {
      seed = {
        'rest': config
      };
      return handles;
    }
  }
};
