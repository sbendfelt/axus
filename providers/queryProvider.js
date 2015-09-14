var unirest = require('unirest');
var sync = require('synchronize');
var appx = require('./config.json');

var QueryProvider = (function() {
  var instance;

  function init() {
    var queries = [];

    var createQuery = function createQuery(type, version) {
      var self = this;
      var q = new Query(self, type, version);
      queries.push(q);
      return q;
    };

    return {
      createQuery: createQuery,
      getQueries: function() {
        return queries.slice();
      }
    };
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };

}());

function Query(parent, type, version) {
  this.parentProvider = parent;
  this.type = type;
  this.apiVersion = version;
  this.oql = null;
}

Query.prototype.setOql = function(oql) {
  this.oql = oql;
  return this;
};

Query.prototype.execute = function() {
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
  result = sync.await(req.end(uniDefer()));
  return result;
};

/**
 * Unirest does not comply with node-style call backs.
 * i.e. (err, result) => {}
 * This function is to coerce Unirest into playing nicely with synchronize
 * @return {[type]} [description]
 */
var uniDefer = () => {
  var nextTick = [global.setImmediate, process.nextTick, function(cb) {
    setTimeout(cb, 0);
  }].find((x) => {
    return x !== undefined;
  });
  var fiber = sync.Fiber.current;
  if (!fiber) {
    throw new Error("no current Fiber, defer can't be used without Fiber!");
  }
  if (fiber._defered) {
    throw new Error("invalid usage, should be clear previous defer!");
  }
  fiber._defered = true;
  var called = false;
  return (response) => {
    var err = response.error;
    var body = response.body;
    if (called) throw new Error('defer cannot be used twice!');
    called = true;
    nextTick(() => {
      if (err) {
        fiber.throwInto(err);
      } else {
        fiber.run(body);
      }
    });
  };
};

module.exports = QueryProvider;
