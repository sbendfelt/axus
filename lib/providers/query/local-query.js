const Query = require('./query');
const QueryResultBuilder = require('./query-result-builder');

class LocalQuery extends Query {
  execute() {
    if(!this.oql) {
      throw new Error('Cannot query without oql!');
    }
    let store = this.bridge.getStore();
    let possibleMatches;
    if (!store || !(possibleMatches = store[this.type])) {
      return QueryResultBuilder.buildResultSet();
    }
    let result = possibleMatches[this.oql];
    return QueryResultBuilder.buildResultSet(result);
  }
}

module.exports = LocalQuery;
