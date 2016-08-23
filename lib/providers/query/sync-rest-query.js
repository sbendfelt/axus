class SyncRestQuery extends RestQuery {

  _requestExecutor(request) {
    return syncrhonizer(request);
  }

}

function syncrhonizer(request) {
  return {
    execute: () => {
      let result;
      result = sync.await(req.end(syncunirest.defer()));
      return result;
    }
  };
}
