const FetchRequest = require('./fetch-request');

class LocalFetchRequest extends FetchRequest {
  execute() {
    const store = this.parentProvider.store;
    let possibleMatches;
    if(!store || !(possibleMatches = store[this.type])) {
      throw new Error('404 the requested resource type was not found in the local store');
    }
    let result = possibleMatches[this.uid];
    if(!result) {
      throw new Error('404 the requested resource was not found in the local store');
    }
    return result;
  }
}

module.exports = LocalFetchRequest;
