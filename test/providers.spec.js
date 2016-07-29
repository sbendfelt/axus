/*jshint expr: true*/
let expect = require('chai').expect;
const seed = {
  '$ParcelTrackerS1': {
    'parcelTrackingId=123': [{
      'uid': 'jjd3790'
    }],
    'a123': {
      'attr': 'value'
    }
  }
};
let lProviders = require('../lib/providers/providers')
  .local
  .seed(seed, []);

describe('providers', () => {
  beforeEach(() => {
    lProviders.reset();
  });

  describe('local', () => {
    describe('queryProvider', () => {
      let x = lProviders
        .getQueryProvider()
        .createQuery('$ParcelTrackerS1', 310)
        .setOQL('parcelTrackingId=123')
        .execute();
      it('can query succesfully', (done) => {
        expect(x).to.be.a('object');
        done();
      });
      it('sets result and resultInfo correctly', (done) => {
        let {
          result,
          resultInfo
        } = x;
        expect(resultInfo).to.be.a('object');
        expect(result).to.be.a('array');
        done();
      });
    });

    describe('persistenceProvider', () => {
      let x = lProviders.getPersistenceProvider();
      let o = {
        type: 'sampleO'
      };
      it('can record saves', (done) => {
        x.save(o);
        let saves = x.getSaves();
        expect(saves).to.deep.equal([o]);
        done();
      });
      it('can record actions', (done) => {
        x.processAction(o, 'Action');
        let actions = x.getActionsToProcess();
        expect(actions).to.deep.equal([{
          target: o,
          action: 'Action'
        }]);
        done();
      });
      it('can record single target publications', (done) => {
        let publication = {
          target: {
            uid: 'dummy'
          },
          topic: 'single target topic'
        };
        x.publishOutbound(publication.target, publication.topic);
        let publications = x.getPublications();
        expect(publications[0]).to.deep.equal(publication);
        done();
      });
      it('can record multi target publications', (done) => {
        let publication = {
          target: {
            uid: 'dummy'
          },
          topic: 'multi target topic',
          withObjects: [{
            type: 'OrderDetail',
            id: '123'
          },
          {
            type: 'InvoiceDetail',
            id: '123Inv'
          }]
        };
        let builder = x.publishOutbound();
        builder.topic(publication.topic);
        builder.target(publication.target);
        publication.withObjects.forEach(function(object) {
          builder.withObject(object.type, object.id);
        });
        builder.build();
        let publications = x.getPublications();
        expect(publications[0]).to.deep.equal(publication);
        done();
      });

      it('can make a fetch request', (done) => {
        const resp = x
          .createFetchRequest('$ParcelTrackerS1', 310, 'a123')
          .execute();
        expect(resp).to.equal(seed.$ParcelTrackerS1.a123);
        done();
      });
    });

    describe('objectFactoryProvider', () => {
      it('can record new objects', (done) => {
        let x = lProviders.getObjectFactoryProvider();
        let created = x.newObject('$MyType');
        expect(x.getCreated()).to.deep.equal([created]);
        done();
      });
    });

    describe('messageProvider', () => {
      it('can log a simple error msg', (done) => {
        console.log('running message prov t1');
        let msg = lProviders.getMessageProvider()
          .error()
          .suppressible(true)
          .build();
        expect([msg]).to.deep.equal(lProviders.getMessageProvider().getMessages());
        done();
      });
      it('can log a simple info msg', (done) => {
        let msg = lProviders.getMessageProvider()
          .info()
          .msgId(1)
          .build();
        expect([msg]).to.deep.equal(lProviders.getMessageProvider().getMessages());
        expect(msg.msgId).to.equal(1);
        done();
      });
    });
  });
});
