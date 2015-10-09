let PersistenceProvider = (function() {
  let instance;

  function init() {
    let toSave = [];
    let toProcessAction = [];
    let publications = [];

    let save = function save(obj) {
      toSave.push(obj);
    };

    let processAction = function processAction(obj, action) {
      toProcessAction.push({
        target: obj,
        action: action
      });
    };

    let publishOutbound = (object, topic) => {
      publications.push({
        topic: topic,
        content: object
      });
    };

    return {
      save: save,
      processAction: processAction,
      publishOutbound: publishOutbound,
      getSaves: () => {
        return toSave.slice();
      },
      getActionsToProcess: () => {
        return toProcessAction.slice();
      },
      getPublications: () => {
        return publications.slice();
      },
      reset: () => {
        toSave = [];
        toProcessAction = [];
        publications = [];
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
