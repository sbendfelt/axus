var myQ = Providers
  .getQueryProvider()
  .createQuery('$ParcelTrackerS1', 310)
  .setOql("manifestReferenceNumber='142936555'")
  .execute();
