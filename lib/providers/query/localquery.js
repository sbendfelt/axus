let Query = require('./query');

let emptyResult = {
  hasResults: false,
  results: undefined
};

class LocalQuery extends Query {
  execute() {
    if(!this.oql) {
      throw new Error('Cannot query without oql!');
    }
    let store = this.parentProvider.store;
    let possibleMatches;
    if (!store || !(possibleMatches = store[this.type])) {
      return emptyResult;
    }
    let result = possibleMatches[this.oql];
    return {
      results: result,
      hasResults: result && result.length > 0
    };
  }
}

module.exports = LocalQuery;
