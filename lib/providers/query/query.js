class Query {
  constructor(bridge, type, version) {
    this.bridge = bridge;
    this.type = type;
    this.apiVersion = version;
    this.oql = null;
  }

  setOQL(oql) {
    this.oql = oql;
    return this;
  }

  execute() {
    throw new Error('Unsupported operation.' +
      'Please use valid subclass');
  }
}

module.exports = Query;
