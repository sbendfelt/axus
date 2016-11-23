const CustomTableProvider = require('./custom-table-provider.js');
const MessageProvider = require('./message-provider.js');
const ObjectFactoryProvider = require('./object-factory-provider.js');
const PersistenceProvider = require('./persistence-provider.js');
const QueryProvider = require('./query-provider.js');
const DataApiProvider = require('./data-api-provider.js');
const Bridge = require('./bridge.js');
const ModuleDigest = require('./../digest/module-digest');

class Providers {
  constructor(bridge) {
    if(!bridge) {
      throw new Error('Cannot instantiate Providers without bridge');
    }
    this.bridge = bridge;
    this.customTableProvider = new CustomTableProvider(bridge);
    this.messageProvider = new MessageProvider();
    this.objectFactoryProvider = new ObjectFactoryProvider();
    this.persistenceProvider = new PersistenceProvider(bridge);
    this.queryProvider = new QueryProvider(bridge);
    this.dataApiProvider = new DataApiProvider(bridge);
  }

  getCustomTableProvider() {
    return this.customTableProvider;
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

  reset() {
    this.customTableProvider.reset();
    this.queryProvider.reset();
    this.persistenceProvider.reset();
    this.messageProvider.reset();
    this.objectFactoryProvider.reset();
  }
}

// module.exports = {
//   local: {
//     seed: (store, digests) => {
//       const moduleDigest = ModuleDigest.build(digests);
//       let bridge = new Bridge({
//         local: store
//       });
//       bridge.addModuleDigest(moduleDigest);
//       return new Providers(bridge);
//     }
//   },
//   rest: {
//     seed: (config, digests) => {
//       let bridge = new Bridge({
//         rest: config
//       }, digests);
//       return new Providers(bridge);
//     }
//   }
// };
module.exports = Providers;
