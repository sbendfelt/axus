var PersistenceProvider = (function() {
  var instance;

  function getInstance() {
    var toSave = [];
    var toProcesAction = [];

    var save = function save(obj) {
      toSave.push(obj);
    };

    var processAction = function processAction(obj, action) {
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
