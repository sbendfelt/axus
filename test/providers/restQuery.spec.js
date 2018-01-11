const expect = require('chai').expect;

describe.skip('RestQuery', function(done) {
  /**
   * This test is here to ensure that we do not repeat
   * mistakes from issue #41.
   * https://github.com/AppXpress/axus/issues/41
   */
  it('doesnt query, but does hold oql', () => {
    const RestQuery = require('../../lib/providers/query/rest-query');
    const aQuery = new RestQuery(
        null /*bridge*/ ,
        null /*type*/ ,
        null /*version*/ )
      .setOQL('der');
    const exec = () => aQuery.execute();
    expect(exec).to.throw(/^Cannot read property 'getCredentials' of null/);
  });
});
