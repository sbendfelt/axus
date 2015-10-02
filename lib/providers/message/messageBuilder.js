let excludedKeys = ['registerMsg'];

class MessageBuilder {

  constructor(lvl, registerFn) {
    this.registerMsg = registerFn;
    this.logLevel = lvl;
    this._msgKey = null;
    this._fieldPath = null;
    this._ruleId = null;
    this._suppressible = false;
    this._args = {};
    this._msgId = null;
  }

  msgKey(msgKey) {
    this._msgKey = msgKey;
    return this;
  }

  fieldPath(fieldPath) {
    this._fieldPath = fieldPath;
    return this;
  }

  ruleId(ruleId) {
    this._ruleId = ruleId;
    return this;
  }

  suppressible(isSuppressible) {
    this._suppressible = isSuppressible;
    return this;
  }

  arg(key, value) {
    this._args[key] = value;
    return this;
  }

  args(args) {
    Object.assign(this._args, args);
    return this;
  }

  msgId(id) {
    this._msgId = id;
    return this;
  }

  build() {
    let msg = Object.keys(this).map((key) => {
        if (excludedKeys.indexOf(key) === -1 &&
          typeof this[key] !== 'function') {
          let obj = {};
          let nkey = key.replace(/^_/, "");
          obj[nkey] = this[key];
          return obj;
        }
      }).filter((item) => {
        return item;  //filter out 'falsey' values, such as undefined,
                      //that can be produced by map()
      })
      .reduce((prev, next) => {
        return Object.assign(prev, next);
      }, {});
    this.registerMsg(msg);
    return msg;
  }
}

module.exports = MessageBuilder;
