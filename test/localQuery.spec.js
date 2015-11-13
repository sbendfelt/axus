/*jshint expr: true*/
let expect = require('chai').expect;
let LocalQuery = require('../lib/providers/query/LocalQuery');

describe('LocalQuery', () => {
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
