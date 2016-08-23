module.exports = function(appxReplServer) {
  return {
    printConnectionParams: () => {
      console.log(JSON.stringify(appxReplServer.connectionParams, undefined, 4));
    },
    switchConnectionParams: (path) => {
      appxReplServer.withConfiguration(path);
      throw new Error('unimplemented');
    }
  };
};
