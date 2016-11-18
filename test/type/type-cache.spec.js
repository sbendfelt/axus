/*jshint expr: true*/
const expect = require('chai').expect;
const Types = require('../../lib/type/types');
const v310Type = require('../../lib/type/v310-type');

describe('TypeCache', () => {

    it('can evictAll', () => {
        const cache = Types.getCacheCopy();
        expect(cache.size).to.be.above(0);
        cache.evictAll();
        expect(cache.size).to.equal(0);
    });

    it('can evict', () => {
        const OrderDetail = new v310Type('OrderDetail');
        const cache = Types.getCacheCopy();
        const initialSize = cache.size;
        const key = OrderDetail.keyFunction(OrderDetail.type);
        expect(cache.hasKey(key)).to.be.true;
        cache.evict(OrderDetail);
        expect(cache.size + 1).to.equal(initialSize);
    });

    it('can register new types', () => {
        const cache = Types.getCacheCopy();
        const cort = new v310Type('CustomObjectS1');
        const initialSize = cache.size;
        cache.register(cort);
        expect(cache.size).to.equal(initialSize + 1);
        const key = cort.keyFunction(cort.type);
        expect(cache.hasKey(key)).to.be.true;
    });

    it('can handle aliasAdded events', () => {
        const aliasName = 'Bologne';
        const cache = Types.getCacheCopy();
        const cort = new v310Type('CustomObjectS1');
        cache.register(cort);
        const initialSize = cache.size;
        cort.addAlias(aliasName);
        expect(cache.size).to.equal(initialSize + 1);
        const key = cort.keyFunction(aliasName);
        expect(cache.hasKey(key)).to.be.true;
    });

    it('can handle aliasRemoved events', () => {
        const aliasName = 'Bologne';
        const cache = Types.getCacheCopy();
        const cort = new v310Type('CustomObjectS1', null, aliasName);
        cache.register(cort);
        const initialSize = cache.size;
        cort.removeAlias(aliasName);
        expect(cache.size).to.equal(initialSize - 1);
        const key = cort.keyFunction(aliasName);
        expect(cache.hasKey(key)).to.be.false;
    });

    it('throws error when trying to insert dup keys');

});
