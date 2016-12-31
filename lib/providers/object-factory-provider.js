const HelpEntryBuilder = require('../repl/help/help-entry-builder');

/**
 * The ObjectFactoryProvider allows for the creation of known object types.
 *
 * For more information, see:
 * https://developer.gtnexus.com/platform/scripts/built-in-functions/creating-an-object
 */
class ObjectFactoryProvider {

  constructor(){
      this.created = [];
  }


  /**
   * newObject - Returns a new instance of an object of the specified type and
   *             version.
   *             For more information, see:
   *             https://developer.gtnexus.com/platform/scripts/built-in-functions/creating-an-object
   *
   * @param  {String} type  The global object type you wish to create an instance
   *                        of.
   * @param  {Number} version The API Version of the type.
   * @return {Object}
   */
  newObject(type, version) {
    let newObj = {type: type};
    this.created.push(newObj);
    return newObj;
  }

  getCreated() {
    return this.created.slice();
  }

  reset() {
    this.created = [];
  }
}

HelpEntryBuilder.forAppXpress(__filename, 'ObjectFactoryProvider').defer();

module.exports = ObjectFactoryProvider;
