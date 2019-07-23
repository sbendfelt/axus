class Query {
  constructor(bridge, type, version) {
    this.bridge = bridge;
    this.type = type;
    this.apiVersion = version;
    this.oql = null;
    this.parameters = {};
  }

  setOQL(oql) {
    this.oql = oql;
    return this;
  }

  addParameter(key, value) {
    this.parameters[key] = value;
    return this;
  }

  execute() {
    throw new Error('Unsupported operation.' +
      'Please use valid subclass');
  }
}

module.exports = Query;
