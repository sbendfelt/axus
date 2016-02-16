const rFetch = require('./fetch/rest-fetch-request');
const lFetch = require('./fetch/local-fetch-request');

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

  publishOutbound(obj, topic) {
    this.publications.push({
      topic: topic,
      content: obj
    });
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
