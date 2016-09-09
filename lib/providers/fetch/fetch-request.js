class FetchRequest {
  constructor(bridge, type, version, id) {
    this.bridge = bridge;
    this.type = type;
    this._apiVersion = version;
    this._uid = id;
    this._params = {};
    this._resource = null;
    this._resourceId = null;
  }

  addParameter(key, value) {
    this._params[key] = value;
    return this;
  }

  apiVersion(version) {
    this._apiVersion = version;
    return this;
  }

  resource() {
    if (arguments.length === 1) {
      this._resource = arguments[0];
    } else if (arguments.length === 2) {
      this._resource = arguments[0];
      this._resourceId = arguments[1];
    } else {
      throw new TypeError('Unsupported parameters used in resource function. Please check persistenceProvider API.');
    }
    return this;
  }

  execute() {
    throw new Error('Unsupported operation.' +
      'Please use valid subclass');
  }

}

module.exports = FetchRequest;
