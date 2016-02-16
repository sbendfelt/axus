let MessageProvider = require('./messageProvider.js');
let ObjectFactoryProvider = require('./objectFactoryProvider.js');
let PersistenceProvider = require('./persistenceProvider.js');
let QueryProvider = require('./queryProvider.js');

class Providers {
  constructor(seed) {
    this.messageProvider = new MessageProvider();
    this.objectFactoryProvider = new ObjectFactoryProvider();
    this.persistenceProvider = new PersistenceProvider(seed);
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
