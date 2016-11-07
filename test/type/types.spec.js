/*jshint expr: true*/
const expect = require('chai').expect;
const Types = require('../../lib/type/types');

describe('Types', () => {
  const o = {
    __metadata: {
      type: 'test'
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
  describe('getType', () => {
    it('returns the Type from APPX_TYPES when present', () => {
      const order = {
        __metadata: {
          type: 'OrderDetail'
        }
      };
      const OrderDetailType = Types.getType(order);
      expect(OrderDetailType.type).to.equal('OrderDetail');
      expect(OrderDetailType.aliases).to.have.length(0);
      expect(OrderDetailType.design).to.be.ok;
    });
  });

});
