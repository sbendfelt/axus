/*jshint expr: true*/
var expect = require('chai').expect;
var lProviders = require('../lib/providers/providers')
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
      var x = lProviders
        .getQueryProvider()
        .createQuery('$ParcelTrackerS1', 310)
        .setOQL('parcelTrackingId=123')
        .execute();
      it('can query succesfully', (done) => {
        expect(x).to.be.a('object');
        done();
      });
      it('sets hasResults properly', (done) => {
        var {
          hasResults, result
        } = x;
        expect(hasResults).to.be.ok;
        done();
      });
    });
  });
});
