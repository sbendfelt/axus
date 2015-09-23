let PersistenceProvider = (function() {
  let instance;

  function getInstance() {
    let toSave = [];
    let toProcesAction = [];

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
      getSaves: toSave.slice(),
      getActionsToProcess: toProcessAction.slice()
    };
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = getInstance();
      }
      return instance;
    }
  };
});

module.exports = PersistenceProvider;
