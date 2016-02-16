class FetchRequest {
  constructor(parent, type, version, id) {
    this.parentProvider = parent;
    this.apiVersion = version;
    this.type = type;
    this.uid = id;
    this.params = {};
    this.resource = null;
    this.resourceId = null;
  }

  addParameter(key, value) {
    params[key] = value;
    return this;
  }

  apiVersion(version) {
    this.apiVersion = version;
    return this;
  }

  resource(resource, id) {
    this.resource = resource;
    this.resourceId = id;
    return this;
  }

  execute() {
    throw new Error('Unsupported operation.' +
      'Please use valid subclass');
  }

}

module.exports = FetchRequest;
