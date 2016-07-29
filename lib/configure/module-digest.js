const PlatformModuleDigestBuilder = require('./builder/platform-module-Digest-builder');
const CustomObjectDesignDigestBuilder = require('./builder/custom-object-design-Digest-builder');

class ModuleDigest {
  constructor(digests) {
      this.digest = digest || [];
      this.platformModuleDigest = PlatformModuleDigestBuilder.build(digests.slice());
      this.customObjectDesignDigest = CustomObjectDesignDigestBuilder.build(digests.slice());
  }

  getPlatformModuleConfiguration() {
      return this.platformModuleDigest.getPlatformModuleDigest();
  }

  getModuleId() {
      return this.platformModuleDigest.getModuleId();
  }

  getModuleName() {
      return this.platformModuleDigest.getModuleName();
  }

  getModuleDescription() {
      return this.platformModuleDigest.getModuleDescription();
  }

  getCustomObjectDesignDigest(globalObjectType) {
    if (this.customObjectDesignDigest) {
      return this.customObjectDesignDigest.getDesignDigest(globalObjectType);
    } else {
      throw new Error('No custom object design Digest found for: ' + globalObjectType);
    }
  }

  getCustomObjectDesignWorkflowFeature(globalObjectType) {
    if (this.customObjectDesignDigest) {
      return this.customObjectDesignDigest.getDesignWorkflowFeature(globalObjectType);
    } else {
      throw new Error('No custom object design workflow feature found for: ' + globalObjectType);
    }
  }

  getCustomObjectDesignApiVersion(globalObjectType) {
    if (this.customObjectDesignDigest) {
      return this.customObjectDesignDigest.getDesignApiVersion(globalObjectType);
    } else {
      throw new Error('No custom object design API version found for: ' + globalObjectType);
    }
  }
}

module.exports = ModuleDigest;
