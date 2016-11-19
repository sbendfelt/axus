const RestFetchRequest = require('./rest-fetch-request');
const FetchRequestValidator = require('./fetch-request-validator');
const ImmutableDefroster = require('../../type/defroster');

class AsyncFetchRequest extends RestFetchRequest {

    execute() {
        const appx = this.bridge.getConfig();
        if (!appx) {
            throw new Error('Could not resolve parent provider config');
        }
        FetchRequestValidator.validate(this);
        const request = RestFetchRequest.buildUnirestRequest(appx, this);
        return new Promise((resolve, reject) => {
            request.end((resp) => {
                const {
                    error,
                    body
                } = resp;
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    }

}

module.exports = AsyncFetchRequest;
