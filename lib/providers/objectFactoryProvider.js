let ObjectFactoryProvider = (function() {
  let instance;

  function init() {
    let created = [];
    return {
      newObject: (type) => {
        let newObj = {
          type: type
        };
        created.push(newObj);
        return newObj;
      },
      getCreated: () => {
        return created.slice();
      }
    };
  }

  return {
    getInstance: () => {
      if(!instance) {
        instance = init();
      }
      return instance;
    }
  };
}());

module.exports = ObjectFactoryProvider;
