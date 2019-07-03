const rRequest = require('./api/rest-script-engine-api-request');
const lRequest = require('./api/local-script-engine-api-request');
const HelpEntryBuilder = require('../repl/help/help-entry-builder');


/**
 * The DataApiProvider is a fall back for functionality that is exposed over the
 * REST API, but not necessarily baked into an existing Provider.
 */
class DataApiProvider {

    constructor(bridge) {
        this.Request = bridge.isRest() ? rRequest : lRequest;
        this.bridge = bridge;
        this.requests = [];
    }

    encode(value) {
        return encodeURIComponent(value);
    }


    /**
     * get - performs an HTTP GET request to the GT Nexus API.
     *       For more information, please see:
     *       https://developer.gtnexus.com/platform/scripts/built-in-functions/api-get-request
     *
     * @param  {String} pathInfo Specify the URL path of the HTTP GET request.
     * @return {DataApiRequest}
     */
    get(pathInfo) {
        return new this.Request(pathInfo, this);
    }

    execute(request) {
        return wrap(request.execute());
    }

    getScriptEngineApiRequests() {
        return this.requests.slice();
    }

    reset() {
        this.requests = [];
    }
}

function wrap(result) {
    if (!(Object.keys(result).length === 1 && result.data)) {
        result = {
            data: result
        };
    }
    return result;
}

HelpEntryBuilder.forAppXpress(__filename, 'DataApiProvider').defer();

module.exports = DataApiProvider;
