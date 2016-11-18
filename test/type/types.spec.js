/*jshint expr: true*/
const expect = require('chai').expect;
const Types = require('../../lib/type/types');

describe('Types', () => {
    const o = {
        __metadata: {
            type: 'test',
            apiVersion: '310'
        }
    };
    describe('getAppXType', () => {
        it('can read and return obj metadata', () => {
            expect(Types.getAppXType(o)).to.equal('test');
        });
    });
    describe('isAppXObject', () => {
        it('can detmerine if _metadata.type is present', () => {
            expect(Types.isAppXObject(o)).to.be.true;
        });
    });
    describe('getTypeDefinition', () => {
        it('returns the Type from APPX_TYPES when present', () => {
            const order = {
                __metadata: {
                    type: 'OrderDetail',
                    apiVersion: '310'
                }
            };
            const OrderDetailType = Types.getTypeDefinition(order);
            expect(OrderDetailType).to.be.ok;
            expect(OrderDetailType.type).to.equal('OrderDetail');
            expect(OrderDetailType.aliases).to.have.length(0);
            expect(OrderDetailType.schema).to.be.ok;
        });
    });

});
