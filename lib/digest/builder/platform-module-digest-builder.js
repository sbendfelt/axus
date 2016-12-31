const PlatformModuleDigest = require('../platform-module-digest');

class PlatformModuleDigestBuilder {

    static build(digests) {
        const {
            moduleDesignDigest,
            moduleId,
            moduleName
        } = getModuleInfo(digests);
        return new PlatformModuleDigest(moduleDesignDigest, moduleId, moduleName);
    }

}

function getModuleInfo(digests) {
    const info = {
        moduleDesignDigest: undefined,
        moduleName: undefined,
        moduleId: undefined
    };
    info.moduleDesignDigest = digests.find(candidateIsPlatformModule);
    if (info.moduleDesignDigest) {
        info.moduleName = info.moduleDesignDigest.PlatformModule.name[0];
        info.moduleId = info.moduleDesignDigest.PlatformModule.moduleId[0];
    }
    return info;
}

const candidateIsPlatformModule =
    (candidate) => candidate && candidate.PlatformModule;

module.exports = PlatformModuleDigestBuilder;
