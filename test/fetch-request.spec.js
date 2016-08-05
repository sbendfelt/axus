/*jshint expr: true*/
const expect = require('chai').expect;
const Bridge = require('../lib/providers/bridge');
const BaseFetchRequest = require('../lib/providers/fetch/fetch-request');
const LocalFetchRequest = require('../lib/providers/fetch/local-fetch-request');
const RestFetchRequest = require('../lib/providers/fetch/rest-fetch-request');
const sync = require('synchronize');

describe('Base FetchRequest', () => {
  it('exposes resource()', () => {
    const fetchReq = new BaseFetchRequest();
    expect(fetchReq.resource()).to.deep.equal(fetchReq);
  });
});

describe.only('restful fetch request', () => {
  it('can fetch', function(done) {
    const bridge = new Bridge({
      rest: {
        "username": "",
        "password": "",
        "dataKey": "",
        "url": "https://commerce-supportq.qa.gtnexus.com/rest/"
      }
    }, []);
    this.timeout(10000); //give api some time
    const req = new RestFetchRequest(
      bridge,
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
    const req = new LocalFetchRequest({
      store: {}
    }, '$GlobalType', 310, 123);
    expect(req.execute).to.throw(Error);
    done();
  });

  it('reveals resource()', () => {
    const req = new LocalFetchRequest({
      store: {}
    }, '$GlobalType', 310, 123);
    expect(req.resource).to.be.a('function');
  });

  it('returns correctly when type and uid specified', (done) => {
    const bridge = new Bridge({
      local: {
        '$GlobalType': {
          123: {
            attr: 'value'
          }
        }
      }
    }, []);
    const req = new LocalFetchRequest(bridge, '$GlobalType', 310, 123);
    const resp = req.execute();
    expect(resp.attr).to.equal('value');
    done();
  });

  // -- these tests are here to ensure that our validator is catching these
  // -- these cases early.
  // -- Once we have a full implementation of local fetch we can deconste these.
  it('throws error on resource request');
  it('throws error on additional params');
});
