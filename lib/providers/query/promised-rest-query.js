class PromisedRestQuery extends RestQuery {

  _requestExecutor(request) {
    return promisify(request);
  }

}

function promiser(request) {
  return {
    execute: promisify(request)
  };
}

const promisify = (request) => {
  return new Promise((resolve, reject) => {
    request.end((response) => {
      if (response.error) {
        reject(response);
      }
      resolve(response);
    });
  });
};
