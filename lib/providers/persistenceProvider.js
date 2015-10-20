class PersistenceProvider {
  constructor() {
    this.toSave = [];
    this.toProcessAction = [];
    this.publications = [];
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
