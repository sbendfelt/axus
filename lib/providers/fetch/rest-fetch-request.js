const https = require('https');
const querystring = require('querystring');
const FetchRequest = require('./fetch-request');
const FetchRequestValidator = require('./fetch-request-validator');

class RestFetchRequest extends FetchRequest {

  static pathFor(root, request) {
    let path;
    if (request._resource) {
      if ('attachments' === request._resource) {
        path = `${root}${request._apiVersion}/${request.type}/${request._uid}/attachments`;
      } else {
        path = `${root}${request._apiVersion}/${request._resource}/${request._resourceId}`;
      }
    } else {
      path = `${root}${request._apiVersion}/${request.type}/${request._uid}`;
    }
    return path;
  }

  static buildUnirestRequest(appx, req) {
    const params = {...restScriptEngineApiRequest.parameters, dataKey: req._params};
    const options = { headers : { ... restScriptEngineApiRequest.headers,
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(appx.username + ":" + appx.password).toString('base64')
    } };
    const cleanedUrl = RestFetchRequest.pathFor(appx.url, req);
    const query = new querystring.stringify(params);

    return new Promise((resolve, reject) => {
      https.get(`${cleanedUrl}?${query}`, options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve(data);
        });
      }).on('error', (error) => {
        reject(`HTTP error! Status Code: ${error.stack ? error.stack : error}`);
      });
    });
  }

  async execute() {
    const appx = this.bridge.getCredentials();
    if(!appx) {
      throw new Error('Could not resolve parent provider config');
    }
    FetchRequestValidator.validate(this);
    return RestFetchRequest.buildUnirestRequest(appx, this);
  }
}

module.exports = RestFetchRequest;
