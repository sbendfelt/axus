var MessageProvider = require('./messageProvider.js');
var ObjectFactoryProvider = require('./objectFactoryProvider.js');
var PersistenceProvider = require('./persistenceProvider.js');
var QueryProvider = require('./queryProvider.js');

var seed;

var getMessageProvider = function getMessageProvider() {
  return MessageProvider.getInstance();
};

var getObjectFactoryProvider = function getObjectFactoryProvider() {
  return new ObjectFactoryProvider.getInstance();
};

var getPersistenceProvider = function getPersistenceProvider() {
  return new PersistenceProvider.getInstance();
};

var getQueryProvider = function getQueryProvider() {
  return new QueryProvider.getInstance(seed);
};

var handles = {
  getQueryProvider: getQueryProvider,
  getPersistenceProvider: getPersistenceProvider,
  getMessageProvider: getMessageProvider,
  getObjectFactoryProvider: getObjectFactoryProvider
};

module.exports = {
  local: {
    seed: (store) => {
      seed = store;
      return handles;
    }
  },
  rest: handles //todo: bake in removal of store?
};
