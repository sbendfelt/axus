const FetchRequest = require('./fetch-request');

class LocalFetchRequest extends FetchRequest {
  execute() {
    const store = this.bridge.getStore();
    if (!store) {
      throw new Error('Illegal state. Could not resolve local store');
    }
    let possibleMatches;
    if (!(possibleMatches = store[this.type])) {
      throw new Error('404 the requested resource type was not found in the local store');
    }
    let result = possibleMatches[this._uid];
    if (!result) {
      throw new Error('404 the requested resource was not found in the local store');
    }
    return result;
  }
}

module.exports = LocalFetchRequest;
