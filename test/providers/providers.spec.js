/*jshint expr: true*/
const expect = require('chai').expect;
const seed = {
  '$ParcelTrackerS1': {
    'parcelTrackingId=123': [{
      'uid': 'jjd3790'
    }],
    'a123': {
      'attr': 'value'
    }
  },
  '$testTableQ1': {
    'Status = \'Active\'': [{
      'testEntries': {
        'field1 = \'fieldValue\'': [{
          'columnA': 'value1',
          'columnB': 'value1',
          'columnC': 'value1'
        }],
        'field1 = \'fieldValue\'columnA =\'value1\',columnA:columnC =\'ZZZZZZ\',columnC': [{
          'columnA': 'value1',
          'columnB': 'value1',
          'columnC': 'AAAAAA'
        }]
      }
    }]
  }
};
const digest = require('../../test/resources/digest/digest.json');
const lProviders = require('../../lib/providers/providers')
  .local
  .seed(seed, digest);

describe('providers', () => {
  beforeEach(() => {
    lProviders.reset();
  });

  describe('local', () => {
    describe('customTableProvider', () => {
      describe('lookup', () => {
        const lookup_positive = lProviders
          .getCustomTableProvider()
          .lookup('$testTableQ1', 'testEntries', 'field1 = \'fieldValue\'');
        const lookup_negative = lProviders
          .getCustomTableProvider()
          .lookup('$testTableQ2', 'testEntries', 'field1 = \'fieldValue\'');
        it('can perform a table lookup succesfully', (done) => {
          expect(lookup_positive).to.be.a('array');
          expect(lookup_positive.length).to.be.ok;
          done();
        });
        it('returns the target lookup row', () => {
          expect(lookup_positive.length).to.equal(1);
          expect(lookup_positive).to.deep.equal([{
            'columnA': 'value1',
            'columnB': 'value1',
            'columnC': 'value1'
          }]);
        });
        it('returns empty when no match is found', () => {
          expect(lookup_negative).to.be.a('array');
          expect(lookup_negative.length).to.equal(0);
        });
      });
      describe('matchLookup', () => {
        const matchLookup_positive = lProviders.getCustomTableProvider()
          .matchLookup('$testTableQ1', 'testEntries')
          .withOql("field1 = 'fieldValue'")
          .optionalMatch("columnA ='value1'", "columnA")
          .optionalMatch("columnC ='ZZZZZZ'", "columnC")
          .execute();
        const matchLookup_negative = lProviders.getCustomTableProvider()
          .matchLookup('$testTableQ2', 'testEntries')
          .withOql("field1 = 'fieldValue'")
          .optionalMatch("columnA ='value1'", "columnA")
          .optionalMatch("columnC ='ZZZZZZ'", "columnC")
          .execute();
        console.log(`***spec result:matchLookup_positive\n
          ${JSON.stringify(matchLookup_positive)}\n***`);
        it('can perform a table matchLookup succesfully', (done) => {
          expect(matchLookup_positive).to.be.a('array');
          expect(matchLookup_positive.length).to.be.ok;
          done();
        });
        it('returns the target matchLookup row', (done) => {
          expect(matchLookup_positive.length).to.equal(1);
          expect(matchLookup_positive).to.deep.equal([{
            'columnA': 'value1',
            'columnB': 'value1',
            'columnC': 'AAAAAA'
          }]);
          done();
        });
        it('returns empty when no match is found', (done) => {
          expect(matchLookup_negative).to.be.a('array');
          expect(matchLookup_negative.length).to.equal(0);
          done();
        });
      });
    });

    describe('queryProvider', () => {
      const x = lProviders
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
      const x = lProviders.getPersistenceProvider();
      const o = {
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
          }, {
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
        const resp = lProviders
          .getPersistenceProvider()
          .createFetchRequest('$ParcelTrackerS1', 310, 'a123')
          .execute();
        expect(resp).to.equal(seed.$ParcelTrackerS1.a123);
        done();
      });
      it('can make a fetch request using incremental parameters', (done) => {
        const lfetchRequest = lProviders
          .getPersistenceProvider()
          .createFetchRequest('$ParcelTrackerS1', null, 'a123');
          lfetchRequest.apiVersion(310);
          const resp = lfetchRequest.execute();
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
