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
    return buildResultSet(result);
  }
}

function buildResultSet(result) {
  if(result && !Array.isArray(result)) {
    result = [result];
  }
  let resultInfo = {
    'count': result.length,
    'hasMore': false,
    'offset': 0,
    'firstRowNumber': result.length > 0 ? 1 : 0,
    'estimatedTotalCount': result.length
  };
  return {
    resultInfo: resultInfo,
    result: result
  };
}
module.exports = LocalQuery;
