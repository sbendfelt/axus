var Query = require('./query');

class RestQuery extends Query {


  execute() {
    if(!q.oql) {
      throw new Error('Cannot query without oql!');
    }
    var req = unirest("GET",
       appx.url + this.apiVersion + "/" + this.type);
    req.query({
      "oql": this.oql,
      "dataKey": appx.dataKey
    });
    req.headers({
      "content-type": "application/json",
    });
    req.auth({
      user: appx.username,
      pass: appx.password,
      sendImmediately: true
    });
    var result;
    result = sync.await(req.end(syncunirest.defer()));
    return result;
  }
}

module.exports = RestQuery;
