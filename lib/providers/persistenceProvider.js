let PersistenceProvider = (function() {
  let instance;

  function init() {
    let toSave = [];
    let toProcessAction = [];

    let save = function save(obj) {
      toSave.push(obj);
    };

    let processAction = function processAction(obj, action) {
      toProcessAction.push({
        'target': obj,
        'action': action
      });
    };

    return {
      save: save,
      processAction: processAction,
      getSaves: () => {
        return toSave.slice();
      },
      getActionsToProcess: () => {
        return toProcessAction.slice();
      }
    };
  }

  return {
    name: 'persistenceProvider',
    getInstance: function() {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
}());

module.exports = PersistenceProvider;
