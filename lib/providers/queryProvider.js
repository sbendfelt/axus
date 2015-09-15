var unirest = require('unirest');
var sync = require('synchronize');
var appx = require('./config.json');
var syncunirest = require('../sync-unirest/sync-unirest');
var rQuery = require('./query/restquery');
var lQuery = require('./query/localquery');

var QueryProvider = (function() {
  var instance;

  function init(store) {

    var queries = [];
    var localStore = null;
    if(typeof store === 'object') {
      localStore = store;
    }

    var createQuery = function createQuery(type, version) {
      var self = this;
      var q;
      if (localStore) {
        q = new lQuery(self, type, version);
      } else {
        q = new rQuery(self, type, version);
      }
      queries.push(q);
      return q;
    };

    return {
      createQuery: createQuery,
      getQueries: () => {
        return queries.slice();
      },
      store: localStore
    };
  }

  return {
    getInstance: (store) => {
      if (!instance) {
        instance = init(store);
      }
      return instance;
    }
  };

}());

module.exports = QueryProvider;
