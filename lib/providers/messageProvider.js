let MessageBuilder = require('./message/messageBuilder');

let MessageProvider = (function() {
  let instance;

  function init() {

    let messages = [];

    let addMsg = (msg) => {
      messages.push(msg);
    };

    return {
      info: () => {
        return new MessageBuilder('info', addMsg);
      },
      error: () => {
        return new MessageBuilder('error', addMsg);
      },
      getMessages: () => {
        return messages.slice();
      },
      reset: () =>  {
        messages = [];
      }
    };
  }

  return {
    getInstance: () => {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };

}());

module.exports = MessageProvider;
