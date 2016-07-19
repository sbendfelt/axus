let rQuery = require('./query/restquery');
let lQuery = require('./query/localquery');

class QueryProvider {

  constructor(seed) {
    this.Query = seed.rest ? rQuery : lQuery;
    this.store = seed.local || {};
    this.config = seed.rest;
    this.queries = [];
  }

  createQuery(type, version) {
    let self = this;
    let q = new this.Query(self, type, version);
    this.queries.push(q);
    return q;
  }

  getQueries() {
    return this.queries.slice();
  }

  reset() {
    this.queries = [];
  }
}

module.exports = QueryProvider;
