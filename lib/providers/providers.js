let MessageProvider = require('./messageProvider.js');
let ObjectFactoryProvider = require('./objectFactoryProvider.js');
let PersistenceProvider = require('./persistenceProvider.js');
let QueryProvider = require('./queryProvider.js');

let seed;

let getMessageProvider = function getMessageProvider() {
  return MessageProvider.getInstance();
};

let getObjectFactoryProvider = function getObjectFactoryProvider() {
  return new ObjectFactoryProvider.getInstance();
};

let getPersistenceProvider = function getPersistenceProvider() {
  return new PersistenceProvider.getInstance();
};

let getQueryProvider = function getQueryProvider() {
  return new QueryProvider.getInstance(seed);
};

let handles = {
  getQueryProvider: getQueryProvider,
  getPersistenceProvider: getPersistenceProvider,
  getMessageProvider: getMessageProvider,
  getObjectFactoryProvider: getObjectFactoryProvider
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
