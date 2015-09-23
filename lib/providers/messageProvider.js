let MessageProvider = (function() {
  let instance;

  function init() {
    let messageBuilder = {
      msgKey: function(msgKey) {
        return this;
      },
      fieldPath: function(fieldPath) {
        return this;
      },
      ruleId: function(ruleId) {
        return this;
      },
      suppressible: function(isSuppressible) {
        return this;
      },
      arg: function(key, value) {
        return this;
      },
      args: function() {
        return this;
      },
      msgId: function() {},
      build: function() {}
    };

    return {
      info: function() {
        return messageBuilder;
      },
      error: function() {
        return messageBuilder;
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

});

module.exports = MessageProvider;
