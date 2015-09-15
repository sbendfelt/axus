class Query {
  constructor(parent, type, version) {
    this.parentProvider = parent;
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
