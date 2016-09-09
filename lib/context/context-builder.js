const Builder = require('./raw-context-builder');
const Providers = require('../providers/providers');
const fs = require('fs');
const path = require('path');

class ContextBuilder {

  constructor () {
    this.explicitRoot = null;
    this.explicitLib = null;
  }

  compose(root) {
    if (!fs.lstatSync(root).isDirectory) {
      root = path.dirname(root);
    }
    this.explicitRoot = root;
    return this;
  }

  getRoot() {
    return this.explicitRoot || getDefaultRoot();
  }

  overrideLib(newLib) {
    this.explicitLib = resolve.call(this, newLib);
    return this;
  }

  getLibrary() {
    return this.explicitLib || getDefaultLibrary.call(this, this);
  }

  build(resourceName, additionalContext) {
    const builder = new Builder()
      .fromRoot(this.getRoot())
      .forNamedResource(resourceName)
      .withLibrary(this.getLibrary())
      .addContext(additionalContext);
    return {
      forRest: (restConfig) => {
        return builder
          .withProvidersImpl(Providers.rest)
          .withRestConfig(restConfig)
          .build();
      },
      forLocal: (store) => {
        return builder
          .withProvidersImpl(Providers.local)
          .withLocalStore(store)
          .build();
      }
    };
  }

}

function getDefaultLibrary() {
  return path.join(this.getRoot(), '..', 'lib');
}

function resolve(name) {
  return path.join(this.getRoot(), name);
}

function getDefaultRoot() {
  return module.parent.filename;
}


module.exports = new ContextBuilder();
