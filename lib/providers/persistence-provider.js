const NotificationBuilder = require('./notification/notification-builder');

class PersistenceProvider {
  constructor(bridge) {
    this.bridge = bridge;
    this.toProcessAction = [];
    this.publications = [];
    this.fetches = [];
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
    let  [type, apiVersion, uid] = Array.prototype.slice.call(arguments);
    return this.bridge.newFetchRequest(type, apiVersion, uid);
  }

  publishOutbound() {
    if (!arguments.length) {
      return new NotificationBuilder((publication) => {
        this.publications.push(publication);
      });
    } else if (arguments.length === 1) {
      throw new TypeError('Single parameter publishOutbound function is not supported at this time.');
    } else if (arguments.length === 2) {
      this.publications.push({
        target: arguments[0],
        topic: arguments[1]
      });
    } else {
      throw new TypeError('Unsupported parameters used in publishOutbound function. Please check persistenceProvider API.');
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

  reset() {
    this.toSave = [];
    this.toProcessAction = [];
    this.publications = [];
  }
}

module.exports = PersistenceProvider;
