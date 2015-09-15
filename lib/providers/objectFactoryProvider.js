var ObjectFactoryProvider = (function() {
  var instance;

  function getInstance() {
    var created = [];
    var newObject = function newObject(type) {
      var newObj = {type: type};
      created.push(newObj);
      return newObj;
    };

  }

  return {
    newObject: function newObject(type) {
      return {};
    }
  };
}());

module.exports = ObjectFactoryProvider;
