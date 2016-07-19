class ObjectFactoryProvider {
  constructor(){
      this.created = [];
  }

  newObject(type) {
    let newObj = {type: type};
    this.created.push(newObj);
    return newObj;
  }

  getCreated() {
    return this.created.slice();
  }

  reset() {
    this.created = [];
  }
}

module.exports = ObjectFactoryProvider;
