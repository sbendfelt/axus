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
      it('sets hasResults properly', (done) => {
        let {
          hasResults, result
        } = x;
        expect(hasResults).to.be.ok;
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
      it('can record publications', (done) => {
        let publication = {
          topic: 'sample topic',
          content: {
            uid: 'dummy'
          }
        };
        x.publishOutbound(publication.content, publication.topic);
        let publications = x.getPublications();
        expect(publications[0]).to.deep.equal(publication);
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
