let rQuery = require('./query/restquery');
let lQuery = require('./query/localquery');

let QueryProvider = (function() {
  let instance;

  function init(seed, q) {

    let queries = [];
    let localSeed = seed;
    let Query = q;

    let createQuery = function createQuery(type, version) {
      let self = this;
      let q = new Query(self, type, version);
      queries.push(q);
      return q;
    };

    return {
      createQuery: createQuery,
      getQueries: () => {
        return queries.slice();
      },
      reset: () => {
        queries = [];
      },
      store: localSeed.local || {},
      config: localSeed.rest  // we do not allow an empty config but we do allow
                              // an empty store
    };
  }

  return {
    getInstance: (seed) => {
      if (!instance) {
        let qType = seed.rest ? rQuery : lQuery;
        instance = init(seed, qType);
      }
      return instance;
    }
  };

}());

module.exports = QueryProvider;
