class PlatformModuleDigest {
  constructor(platformModuleDigest, moduleId, moduleName) {
    this.platformModuleDigest = platformModuleDigest;
    this.moduleId = moduleId;
    this.moduleName = moduleName;
  }

  getPlatformModuleDigest() {
    return this.platformModuleDigest;
  }

  getModuleId() {
    return this.moduleId;
  }

  getModuleName() {
    return this.moduleName;
  }
}

module.exports = PlatformModuleDigest;
