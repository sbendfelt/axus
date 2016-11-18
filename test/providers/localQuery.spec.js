/*jshint expr: true*/
let expect = require('chai').expect;
let LocalQuery = require('../../lib/providers/query/local-query');
let Bridge = require('../../lib/providers/bridge');

// this must be moved to use the factory, else bridge is not present.
describe('LocalQuery', () => {
    let bridge = new Bridge({
        local: {
            '$ParcelTrackerS1': {
                'muppet': [],
                'dozer': ['fraggle', 'rock']
            }
        },
        digests: []
    });
    it('handles null results', (done) => {
        let aQuery = new LocalQuery(bridge, '$ParcelTrackerS1', 310);
        aQuery.setOQL('snuffalupagos');
        let results = aQuery.execute();
        expect(results.hasResults).to.be.false;
        done();
    });
    it('returns results', (done) => {
        let aQuery = new LocalQuery(bridge, '$ParcelTrackerS1', 310);
        aQuery.setOQL('dozer');
        let results = aQuery.execute();
        expect(results.result.length).to.equal(2);
        expect(results.result[0]).to.equal('fraggle');
        expect(results.result[1]).to.equal('rock');
        done();
    });
});
