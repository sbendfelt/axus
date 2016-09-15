const NotificationBuilder = require('./notification/notification-builder');

class PersistenceProvider {
  constructor(bridge) {
    this.toSave = [];
    this.bridge = bridge;
    this.toProcessAction = [];
    this.publications = [];
    this.fetches = [];
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
    if (!arguments.length || arguments.length === 1) {
      let  [type] = Array.prototype.slice.call(arguments);
      return this.bridge.newFetchRequest(type);
    } else if (arguments.length === 2) {
      let  [type, uid] = Array.prototype.slice.call(arguments);
      return this.bridge.newFetchRequest(type, null, uid);
    } else if (arguments.length === 3) {
      let  [type, apiVersion, uid] = Array.prototype.slice.call(arguments);
      return this.bridge.newFetchRequest(type, apiVersion, uid);
    } else {
      throw new TypeError(`Unsupported parameters used in createFetchRequest
        function. Please check persistenceProvider API.`);
    }
  }

  publishOutbound() {
    if (!arguments.length) {
      return new NotificationBuilder((publication) => {
        this.publications.push(publication);
      });
    } else if (arguments.length === 1) {
      throw new TypeError(`Single parameter publishOutbound function
        is not supported at this time.`);
    } else if (arguments.length === 2) {
      this.publications.push({
        target: arguments[0],
        topic: arguments[1]
      });
    } else {
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

  execute(request) {
    if(!request.execute) {
      throw new TypeError(`Request cannot be executed.
        Please check that this is actually a request.`);
    }
    return request.execute();
  }

  reset() {
    this.toSave = [];
    this.toProcessAction = [];
    this.publications = [];
  }
}

module.exports = PersistenceProvider;
