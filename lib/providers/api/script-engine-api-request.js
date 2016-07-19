class ScriptEngineApiRequest {

  constructor(pathInfo, parentProvider) {
    this.parentProvider = parentProvider;
    this.pathInfo = pathInfo;
    this.parameters = {};
    this.headers = {};
  }

  execute() {
    throw new Error("Execute is not implemeted for the base class. Please use a RESTful or Local instance");
  }

  withHeader(name, value) {
    this.headers[name] = value;
    return this;
  }

  withParameter(key, value) {
    this.parameters[key] = value;
    return this;
  }
}

module.exports = ScriptEngineApiRequest;
