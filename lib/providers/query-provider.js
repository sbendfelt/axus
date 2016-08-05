class QueryProvider {

  constructor(bridge) {
    this.bridge = bridge;
    this.queries = [];
  }

  createQuery(type, version) {
    let self = this;
    let query = this.bridge.newQuery(type, version);
    this.queries.push(query);
    return query;
  }

  getQueries() {
    return this.queries.slice();
  }

  reset() {
    this.queries = [];
  }
}

module.exports = QueryProvider;
