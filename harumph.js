var Providers = require('./providers/providers');

var myQ = Providers
  .getQueryProvider()
  .createQuery('$ParcelTrackerS1', 310)
  .setOql("manifestReferenceNumber='142936555'")
  .execute();
console.log('da fuq: ' + JSON.stringify(myQ, null, 2));
