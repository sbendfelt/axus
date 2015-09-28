let ObjectFactoryProvider = (function() {
  let instance;

  function getInstance() {
    let created = [];
    let newObject = function newObject(type) {
      let newObj = {
        type: type
      };
      created.push(newObj);
      return newObj;
    };
  }

  return {
    newObject: function newObject(type) {
      return {};
    },
    getCreated: () => {
      return created.slice();
    }
  };
}());

module.exports = ObjectFactoryProvider;
