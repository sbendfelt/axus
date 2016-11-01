const NotificationBuilder = require('./notification/notification-builder');

class PersistenceProvider {
  constructor(bridge) {
    this.toSave = [];
    this.bridge = bridge;
    this.toProcessAction = [];
    this.publications = [];
    this.fetchRequests = [];
    this.toSave = [];
  }

  save(obj) {
    this.toSave.push(obj);
  }

  processAction(obj, action) {
    this.toProcessAction.push({
      target: obj,
      action: action
    });
  }

  createFetchRequest() {
    const argLength = arguments.length;
    if (!argLength || argLength > 3) {
      throw new TypeError(`Unsupported parameters used in createFetchRequest
        function. Please check persistenceProvider API.`);
    }
    let req;
    if (argLength === 1) {
      const [type] = Array.prototype.slice.call(arguments);
      req = this.bridge.newFetchRequest(type);
    } else if (argLength === 2) {
      const [type, uid] = Array.prototype.slice.call(arguments);
      req = this.bridge.newFetchRequest(type, null, uid);
    } else if (argLength === 3) {
      const [type, apiVersion, uid] = Array.prototype.slice.call(arguments);
      req = this.bridge.newFetchRequest(type, apiVersion, uid);
    }
    this.fetchRequests.push(req);
    return req;
  }

  publishOutbound() {
    const argLength = arguments.length;
    if (!arguments.length) {
      return new NotificationBuilder((publication) => {
        this.publications.push(publication);
      });
    }
    if (argLength === 2) {
      this.publications.push({
        target: arguments[0],
        topic: arguments[1]
      });
    } else {
      if (argLength === 1) {
        throw new TypeError(`Single parameter publishOutbound function
          is not supported at this time.`);
      }
      throw new TypeError(`Unsupported parameters used in publishOutbound
        function. Please check persistenceProvider API.`);
    }
  }

  getSaves() {
    return this.toSave.slice();
  }

  getActionsToProcess() {
    return this.toProcessAction.slice();
  }

  getPublications() {
    return this.publications.slice();
  }

  getFetchRequests() {
    return this.fetchRequests.slice();
  }

  execute(request) {
    if (!request.execute) {
      throw new TypeError(`Request cannot be executed.
        Please check that this is actually a request.`);
    }
    return request.execute();
  }

  reset() {
    this.toSave = [];
    this.toProcessAction = [];
    this.publications = [];
    this.fetchRequests = [];
  }
}

module.exports = PersistenceProvider;
