var Query = require('./query');

var emptyResult = {
  hasResults: false,
  results: undefined
};

class LocalQuery extends Query {
  execute() {
    if(!this.oql) {
      throw new Error('Cannot query without oql!');
    }
    var store = this.parentProvider.store;
    var possibleMatches;
    if (!store || !(possibleMatches = store[this.type])) {
      return emptyResult;
    }
    var result = possibleMatches[this.oql];
    return {
      results: result,
      hasResults: result && result.length > 0
    };
  }
}

module.exports = LocalQuery;
