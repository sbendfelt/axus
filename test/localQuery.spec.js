/*jshint expr: true*/
let expect = require('chai').expect;
let LocalQuery = require('../lib/providers/query/localquery');

// this must be moved to use the factory, else bridge is not present.
describe.skip('LocalQuery', () => {
  it('handles null results', (done) => {
      let aQuery = new LocalQuery({
        store: {
          '$ParcelTrackerS1' : {
            'muppet': []
          }
        }
      }, '$ParcelTrackerS1', 310);
      aQuery.setOQL('snuffalupagos');
      let results = aQuery.execute();
      expect(results.hasResults).to.be.false;
      done();
  });
});
