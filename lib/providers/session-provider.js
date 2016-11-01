class SessionProvider {

  constructor(bridge) {
    this.bridge = bridge;
  }

  getCurrentUserId() {
    return this.bridge.getRunAsScope().userId;
  }

  getCurrentOrgId() {
    return this.bridge.getRunAsScope().orgId;
  }

  getCurrentOrgName() {
    return this.bridge.getRunAsScope().orgName;
  }

  getCurrentOrgRoles() {
    return this.bridge.getRunAsScope().orgRoles;
  }
}

module.exports = SessionProvider;
