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

  resource(resource, id) {
    this._resource = resource;
    this._resourceId = id;
    return this;
  }

  execute() {
    throw new Error('Unsupported operation.' +
      'Please use valid subclass');
  }

}

module.exports = FetchRequest;
