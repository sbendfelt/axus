/*jshint expr: true*/
let expect = require('chai').expect;
let BaseFetchRequest = require('../lib/providers/fetch/fetch-request');
let LocalFetchRequest = require('../lib/providers/fetch/local-fetch-request');
let RestFetchRequest = require('../lib/providers/fetch/rest-fetch-request');
let sync = require('synchronize');

describe('Base FetchRequest', () => {
  it('exposes resource()', () => {
    const fetchReq = new BaseFetchRequest();
    expect(fetchReq.resource('')).to.deep.equal(fetchReq);
  });
});

describe.skip('restful fetch request', () => {
  it('can fetch', function(done) {
    this.timeout(10000); //give api some time
    const req = new RestFetchRequest({
        config: {
          "username": "<username>",
          "password": "<password>",
          "dataKey": "<dataKey>",
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
  it('can fetch all attachments', function(done) {
    this.timeout(10000); //give api some time
    const req = new RestFetchRequest({
        config: {
          "username": "<username>",
          "password": "<password>",
          "dataKey": "<dataKey>",
          "url": "https://commerce-supportq.qa.gtnexus.com/rest/"
        }
      },
      '$DocumentPouchC1',
      310,
      '180556998'
    );
    req.resource('attachments');
    sync.fiber(() => {
      const response = req.execute();
      expect(response).to.be.ok;
      expect(response.result.length).to.equal(2);
      done();
    });
  });
  it('can fetch an attachment', function(done) {
    this.timeout(10000); //give api some time
    const req = new RestFetchRequest({
        config: {
          "username": "<username>",
          "password": "<password>",
          "dataKey": "<dataKey>",
          "url": "https://commerce-supportq.qa.gtnexus.com/rest/"
        }
      },
      '$DocumentPouchC1',
      310,
      '180556998'
    );
    req.resource('attachment', '180780897');
    sync.fiber(() => {
      const response = req.execute();
      expect(response).to.be.ok;
      expect(response).to.not.equal(undefined);
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
    const req = new LocalFetchRequest({
      store: {
        '$GlobalType': {
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

  it('supports resource("attachments")', (done) => {
    const req = new LocalFetchRequest({
      store: {
        '$GlobalType': {
          '123/attachments': [{
              "attachmentUid": "1",
          }, {
              "attachmentUid": "2",
          }, {
              "attachmentUid": "3",
          }, {
              "attachmentUid": "4",
          }]
        }
      }
    }, '$GlobalType', 310, 123);
    req.resource('attachments');
    const resp = req.execute();
    expect(resp.length).to.equal(4);
    done();
  });

  // -- these tests are here to ensure that our validator is catching these
  // -- these cases early.
  // -- Once we have a full implementation of local fetch we can delete these.
  it('throws error on resource request');
  it('throws error on additional params');
});
