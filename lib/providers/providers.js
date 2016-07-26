const MessageProvider = require('./message-provider.js');
const ObjectFactoryProvider = require('./object-factory-provider.js');
const PersistenceProvider = require('./persistence-provider.js');
const QueryProvider = require('./query-provider.js');
const DataApiProvider = require('./data-api-provider.js');
const Configurations = require('../configure/configurations.js');

class Providers {
  constructor(seed, configurations) {
    this.messageProvider = new MessageProvider();
    this.objectFactoryProvider = new ObjectFactoryProvider();
    this.persistenceProvider = new PersistenceProvider(seed);
    this.queryProvider = new QueryProvider(seed);
    this.dataApiProvider = new DataApiProvider(seed);
    this.configurations = new Configurations(configurations);
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
    return this.dataApiProvider;
  }

  getConfigurations() {
    return this.configurations;
  }

  reset() {
    this.queryProvider.reset();
    this.persistenceProvider.reset();
    this.messageProvider.reset();
    this.objectFactoryProvider.reset();
    this.dataApiProvider.reset();
  }

}

module.exports = {
  local: {
    seed: (store, configurations) => {
      return new Providers({
        local: store,
      }, configurations);
    }
  },
  rest: {
    seed: (config, configurations) => {
      return new Providers({
        rest: config,
      }, configurations);
    }
  }
};
