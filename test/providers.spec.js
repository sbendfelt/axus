/*jshint expr: true*/
let expect = require('chai').expect;
let lProviders = require('../lib/providers/providers')
  .local
  .seed({
    '$ParcelTrackerS1': {
      'parcelTrackingId=123': [{
        'uid': 'jjd3790'
      }]
    }
  });

describe('providers', () => {
  describe('local', () => {
    describe('queryprovider', () => {
      let x = lProviders
        .getQueryProvider()
        .createQuery('$ParcelTrackerS1', 310)
        .setOQL('parcelTrackingId=123')
        .execute();
      it('can query succesfully', (done) => {
        expect(x).to.be.a('object');
        done();
      });
      it('sets hasResults properly', (done) => {
        let {
          hasResults, result
        } = x;
        expect(hasResults).to.be.ok;
        done();
      });
    });
  });
});
