let MessageProvider = require('./messageProvider.js');
let ObjectFactoryProvider = require('./objectFactoryProvider.js');
let PersistenceProvider = require('./persistenceProvider.js');
let QueryProvider = require('./queryProvider.js');

class Providers {
  constructor(seed) {
    this.messageProvider = new MessageProvider();
    this.objectFactoryProvider = new ObjectFactoryProvider();
    this.persistenceProvider = new PersistenceProvider();
    this.queryProvider = new QueryProvider(seed);
  }

  getMessageProvider() {
    return this.messageProvider;
  }

  getObjectFactoryProvider() {
    return this.objectFactoryProvider;
  }

  getPersistenceProvider() {
    return this.persistenceProvider;
  }

  getQueryProvider() {
    return this.queryProvider;
  }

  reset() {
    this.queryProvider.reset();
    this.persistenceProvider.reset();
    this.messageProvider.reset();
    this.objectFactoryProvider.reset();
  }

}


// let seed;
//
// let getMessageProvider = function getMessageProvider() {
//   return MessageProvider.getInstance();
// };
//
// let getObjectFactoryProvider = function getObjectFactoryProvider() {
//   return ObjectFactoryProvider.getInstance();
// };
//
// let getPersistenceProvider = function getPersistenceProvider() {
//   return PersistenceProvider.getInstance();
// };
//
// let getQueryProvider = function getQueryProvider() {
//   return QueryProvider.getInstance(seed);
// };
//
// let handles = {
//   getQueryProvider: getQueryProvider,
//   getPersistenceProvider: getPersistenceProvider,
//   getMessageProvider: getMessageProvider,
//   getObjectFactoryProvider: getObjectFactoryProvider,
//   reset: () => {
//     getQueryProvider().reset();
//     getMessageProvider().reset();
//     getObjectFactoryProvider().reset();
//     getPersistenceProvider().reset();
//   }
// };

module.exports = {
  local: {
    seed: (store) => {
      return new Providers({
        local: store
      });
    }
  },
  rest: {
    seed: (config) => {
      return new Providers({
        rest: config
      });
    }
  }
};
