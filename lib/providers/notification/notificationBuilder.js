let excludedKeys = ['registerNotification'];

class NotificationBuilder {

  constructor(registerFn) {
    this.registerNotification = registerFn; //TODO: typeof registerFn === fn ?
    this._topic = null;
    this._target = null;
    this._withObjects = [];
  }

  topic(topicName) {
    this._topic = topicName;
    return this;
  }

  target(target) {
    this._target = target;
    return this;
  }

  withObject(type, id) {
    this._withObjects.push({
      type: type,
      id: id
    });
    return this;
  }

  build() {
    let publication = Object.keys(this).map((key) => {
        if (excludedKeys.indexOf(key) === -1 &&
          typeof this[key] !== 'function') {
          let obj = {};
          let nkey = key.replace(/^_/, "");
          obj[nkey] = this[key];
          return obj;
        }
      })
      .filter((item) => {
        return item;  //filter out 'falsey' values, such as undefined,
                      //that can be produced by map()
      })
      .reduce((prev, next) => {
        return Object.assign(prev, next);
      }, {});
    this.registerNotification(publication);
    return publication;
  }
}

module.exports = NotificationBuilder;
