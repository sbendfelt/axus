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
                    throw new Error('404 the requested attachment resource was not found in the local store');
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
                throw new Error(`404 the requested type: ${this.type} was not found in the local store`);
            }
            result = possibleMatches[String(this._uid)];
            if (!result) {
                throw new Error(`404 the requested type: ${this.type} uid: ${this._uid}::${Object.prototype.toString.call(this._uid)} was not found in the local store
                  Possible matches included:
                  ${explain(possibleMatches)}`);
            }
        }
        return result;
    }
}

function explain(possibleMatches) {
    const i = Object
        .keys(possibleMatches)
        .reduce((acc, next) => {
          acc.push(`${next}::${Object.prototype.toString.call(next)} -> \n${JSON.stringify(possibleMatches[next])}`);
          return acc;
        }, []);
    return i.join('\n');
}

module.exports = LocalFetchRequest;
