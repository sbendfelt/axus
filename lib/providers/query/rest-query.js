const https = require('https');
const querystring = require('querystring');
const Query = require('./query');

class RestQuery extends Query {

    execute() {
        buildRequest.call(this);
    }

}

async function buildRequest() {
    if (!this.oql) {
        throw new Error('Cannot query without oql!');
    }
    const appx = this.bridge.getCredentials();
    if (!appx) {
        throw new Error('Illegal state could not resolve queryProvider REST config');
    }

    const params = {
        'oql': this.oql,
        'dataKey': appx.dataKey
    };
    const options = {headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(appx.username + ":" + appx.password).toString('base64')
      }};
    const cleanedUrl = appx.url + this.apiVersion + '/' + this.type;
    const query = new URLSearchParams(params);

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

function defaultRequest(restScriptEngineApiRequest, appxConfig) {
  const params = {...restScriptEngineApiRequest.parameters, dataKey: appxConfig.dataKey};
  const options = { headers: { ... restScriptEngineApiRequest.headers,
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Buffer.from(auth.username + ":" + auth.password).toString('base64')
  } };
  const cleanedUrl = buildRequestUrl(appxConfig.url, restScriptEngineApiRequest.pathInfo);
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

module.exports = RestQuery;
