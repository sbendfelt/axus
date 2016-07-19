const MessageProvider = require('./message-provider.js');
const ObjectFactoryProvider = require('./object-factory-provider.js');
const PersistenceProvider = require('./persistence-provider.js');
const QueryProvider = require('./query-provider.js');
const DataApiProvider = require('./data-api-provider.js');

class Providers {
  constructor(seed) {
    this.messageProvider = new MessageProvider();
    this.objectFactoryProvider = new ObjectFactoryProvider();
    this.persistenceProvider = new PersistenceProvider(seed);
    this.queryProvider = new QueryProvider(seed);
    this.dataApiProvider = new DataApiProvider(seed);
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

  getDataApiProvider() {

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
