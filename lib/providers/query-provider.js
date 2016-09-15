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

  execute(query) {
    if(!query.execute) {
      throw new TypeError(`Query cannot be executed.
        Please check that this is actually a query.`);
    }
    return query.execute();
  }

  getQueries() {
    return this.queries.slice();
  }

  reset() {
    this.queries = [];
  }
}

module.exports = QueryProvider;
