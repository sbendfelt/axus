const PlatformModuleDigest = require('../platform-module-Digest');

class PlatformModuleDigestBuilder {
    static build(Digests) {
        let moduleDesignDigest = {};
        let moduleId = {};
        let moduleName = {};

        try {
            let moduleDesignDigests = Digests.filter(function(Digest) {
                return Digest && Digest.PlatformModule;
            });
            if (moduleDesignDigests.length) {
              moduleDesignDigest = moduleDesignDigests[0];
              moduleId = moduleDesignDigests[0].PlatformModule.moduleId[0];
              moduleName = moduleDesignDigests[0].PlatformModule.name[0];
            }
            return new PlatformModuleDigest(moduleDesignDigest, moduleId, moduleName);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = PlatformModuleDigestBuilder;
