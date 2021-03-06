const rFetch = require('./fetch/rest-fetch-request');
const lFetch = require('./fetch/local-fetch-request');

let NotificationBuilder = require('./notification/notificationBuilder');

class PersistenceProvider {
  constructor(seed) {
    this.toSave = [];
    this.toProcessAction = [];
    this.publications = [];
    this.fetches = [];
    this.FetchRequest = seed.rest ? rFetch : lFetch;
    this.store = seed.local || {};
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
    let type, apiVersion, uid;
    const args = Array.prototype.slice.call(arguments);
    [type, apiVersion, uid] = args;
    return new this.FetchRequest(this, type, apiVersion, uid);
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
