var MessageProvider = require('./messageProvider.js');
var ObjectFactoryProvider = require('./objectFactoryProvider.js');
var PersistenceProvider = require('./persistenceProvider.js');
var QueryProvider = require('./queryProvider.js');

module.exports = (function() {

  var getMessageProvider = function getMessageProvider() {
    return MessageProvider.getInstance();
  };

  var getObjectFactoryProvider = function getObjectFactoryProvider() {
    return new ObjectFactoryProvider.getInstance();
  };

  var getPersistenceProvider = function getPersistenceProvider() {
    return new PersistenceProvider.getInstance();
  };

  var getQueryProvider = function getQueryProvider() {
    return new QueryProvider.getInstance();
  };

  return {
    getQueryProvider: getQueryProvider
  };

}());
