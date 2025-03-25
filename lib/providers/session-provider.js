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

  getCurrentUserNumericId() {
    return this.bridge.getRunAsScope().userNumericId;
  }

  getLocale() {
    return this.bridge.getRunAsScope().locale;
  }

  getCurrentOrgRoles() {
    return this.bridge.getRunAsScope().orgRoles;
  }

  log(message) {
    var log = 'com.tradecard.platform.scripting.PlatformScriptSessionProviderImpl'+
      ' - PLATFORM SCRIPT LOG: '+
      'EventName=null, '+ 
      'PlatformModuleId=null, '+ 
      'ModuleOwner='+this.bridge.getRunAsScope().orgId+', '+ 
      'LicenseeOrg='+this.bridge.getRunAsScope().orgId+' ('+this.bridge.getRunAsScope().orgName+'), '+
      'RequestingUser='+this.bridge.getRunAsScope().userNumericId+' ('+this.bridge.getRunAsScope().userId+'), '+
      'RequestingOrg='+this.bridge.getRunAsScope().orgId+' ('+this.bridge.getRunAsScope().orgName+'), '+
      'Locale='+this.bridge.getRunAsScope().locale+' '+
      'RequestUUID='+this.bridge.getId()+', '+
      message;
    return log;
  }
}

module.exports = SessionProvider;
