/*jshint expr: true*/
let expect = require('chai').expect;
let LocalFetchRequest = require('../lib/providers/fetch/local-fetch-request');
let RestFetchRequest = require('../lib/providers/fetch/rest-fetch-request');
let sync = require('synchronize');

describe.skip('restful fetch request', () => {
  it('can fetch', function(done) {
    this.timeout(10000); //give api some time
    const req = new RestFetchRequest({
        config: {
          "username": "john.donovan@gtnexus",
          "password": "abura-ya",
          "dataKey": "36f71b26bca202c61973809143a58f7b12fe42a8",
          "url": "https://commerce-supportq.qa.gtnexus.com/rest/"
        }
      },
      '$DocPouchInvoiceLinkS1',
      310,
      '157613553'
    );
    sync.fiber(() => {
      const response = req.execute();
      expect(response).to.be.ok;
      expect(response.__metadata.uid).to.equal('157613553');
      done();
    });
  });
});

describe('local fetch request', () => {
  it('throws 404 on not found', (done) => {
    const req = new LocalFetchRequest({store: {}}, '$GlobalType', 310, 123);
    expect(req.execute).to.throw(Error);
    done();
  });

  it('returns correctly when type and uid specified', (done) => {
    const req = new LocalFetchRequest({
      store: {
        '$GlobalType' :{
          123: {
            attr: 'value'
          }
        }
      }
    }, '$GlobalType', 310, 123);
    const resp = req.execute();
    expect(resp.attr).to.equal('value');
    done();
  });

  // -- these tests are here to ensure that our validator is catching these
  // -- these cases early.
  // -- Once we have a full implementation of local fetch we can delete these.
  it('throws error on resource request');
  it('throws error on additional params');
});
