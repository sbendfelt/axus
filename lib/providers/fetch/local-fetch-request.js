const FetchRequest = require('./fetch-request');
const QueryResultBuilder = require('../query/query-result-builder');

class LocalFetchRequest extends FetchRequest {
  execute() {
    const store = this.bridge.getStore();
    if (!store) {
      throw new Error('Illegal state. Could not resolve local store');
    }

    let possibleMatches;
    let result;
    if (this._resource) {
      if ('attachments' === this._resource) {
        if (!(possibleMatches = store[this.type])) {
          throw new Error('404 the requested resource type was not found in the local store');
        }
        result = possibleMatches[this._uid + '/attachments'];
        if (!result) {
          throw new Error('404 the requested resource was not found in the local store');
        } else {
          result = QueryResultBuilder.buildResultSet(result);
        }
      } else {
        if (!(possibleMatches = store[this._resource])) {
          throw new Error('404 the requested resource type was not found in the local store');
        }
        result = possibleMatches[this._uid];
        if (!result) {
          throw new Error('404 the requested resource was not found in the local store');
        }
      }
    } else {
      if (!(possibleMatches = store[this.type])) {
        throw new Error('404 the requested resource type was not found in the local store');
      }
      result = possibleMatches[this._uid];
      if (!result) {
        throw new Error('404 the requested resource was not found in the local store');
      }
    }
    return result;
  }
}

module.exports = LocalFetchRequest;
