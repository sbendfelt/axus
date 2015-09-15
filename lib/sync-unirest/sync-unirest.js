
var syncunirest = (() => {

  /**
   * Unirest does not comply with node-style call backs.
   * 	i.e. (err, result) => {}
   * This function is to coerce Unirest into playing nicely with synchronize
   * @return {[type]} [description]
   */
  var defer = () => {
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

  return {
    defer: defer
  };
}());

module.exports = syncunirest;
