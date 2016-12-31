const HelpEntryBuilder = require('../repl/help/help-entry-builder');

/**
 * Allows scripting to query for objects, using Object Query Language (OQL).
 * For more information on OQL, see:
 * https://developer.gtnexus.com/platform/querying-with-oql#!
 */
class QueryProvider {

  constructor(bridge) {
    this.bridge = bridge;
    this.queries = [];
  }


  /**
   * createQuery - Builds a query for objects of the specified type, and
   *               optional version.
   *
   * @param  {String} type    The global object type for which we will query.
   * @param  {type} version The API Version to use.
   * @return {PlatformQuery}
   */
  createQuery(type, version) {
    let self = this;
    let query = this.bridge.newQuery(type, version);
    this.queries.push(query);
    return query;
  }


  /**
   * execute - Executes the given query and returns its result.
   *
   * @param  {PlatformQuery} query The query to execute.
   * @return {Object}
   */
  execute(query) {
    if(!query.execute) {
      throw new TypeError(`Query cannot be executed.
        Please check that this is actually a query.`);
    }
    return query.execute();
  }

  getQueries() {
    return this.queries.slice();
  }

  reset() {
    this.queries = [];
  }
}

HelpEntryBuilder.forAppXpress(__filename, 'QueryProvider').defer();

module.exports = QueryProvider;
