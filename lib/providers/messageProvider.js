let MessageBuilder = require('./message/messageBuilder');

class MessageProvider {
  constructor() {
    this.messages = [];
  }

  info() {
    let self = this;
    return new MessageBuilder('info', (msg) => {
      this.messages.push(msg);
    });
  }

  error() {
    return new MessageBuilder('error', (msg) => {
      this.messages.push(msg);
    });
  }

  getMessages() {
    return this.messages.slice();
  }

  reset() {
    this.messages = [];
  }
}

module.exports = MessageProvider;
