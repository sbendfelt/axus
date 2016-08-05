const PlatformModuleDigest = require('../platform-module-digest');

class PlatformModuleDigestBuilder {
  static build(digests) {
    let moduleDesignDigest = {};
    let moduleId = {};
    let moduleName = {};
    let moduleDesignDigests = digests.filter(function(digest) {
      return digest && digest.PlatformModule;
    });
    if (moduleDesignDigests.length) {
      moduleDesignDigest = moduleDesignDigests[0];
      moduleId = moduleDesignDigests[0].PlatformModule.moduleId[0];
      moduleName = moduleDesignDigests[0].PlatformModule.name[0];
    }
    return new PlatformModuleDigest(moduleDesignDigest, moduleId, moduleName);
  }
}

module.exports = PlatformModuleDigestBuilder;
