const PlatformModuleDigest = require('../platform-module-digest');

class PlatformModuleDigestBuilder {
    static build(digests) {
        let moduleId = {};
        let moduleName = {};
        let moduleDesignDigest = {};
        moduleDesignDigest = digests.find((candidate) => {
            return candidate && candidate.PlatformModule;
        });

        if (moduleDesignDigest) {
            moduleId = moduleDesignDigest.PlatformModule.moduleId[0];
            moduleName = moduleDesignDigest.PlatformModule.name[0];
        }
        return new PlatformModuleDigest(moduleDesignDigest, moduleId, moduleName);
    }
}

module.exports = PlatformModuleDigestBuilder;
