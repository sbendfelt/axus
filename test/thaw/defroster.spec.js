const expect = require('chai').expect;
const Defroster = require('../../lib/thaw/defroster');

describe.only('Defroster', () => {
  describe('defrosting a packing list', () => {
    const de = new Defroster();
    const o = de.defrost('./test/resources/pkm.json');
    it('correctly transforms scalar fields', () => {
      expect(o.reopenCount).to.be.a('number');
      expect(o.packingListUid).to.be.a('number');
      expect(o.subMessageId).to.be.a('string');
    });
    describe('defrosting parties', () => {
      it('defrosted the oog correctly', () => {
          const oog = o.party.OriginOfGoods[0];
          expect(oog.partyRoleCode).to.be.a('string');
          expect(oog.name).to.be.a('string');
          expect(oog.memberId).to.be.a('number');
          expect(oog.partyUid).to.be.a('number');
          expect(oog.address.addressUid).to.be.a('number');
      });
    });
    it('defrosted a shipmentItem correctly', () => {
      const item = o.shipmentItem[0];
      expect(item.orderedQuantity).to.be.a('number');
      expect(item.baseItem.itemUid).to.be.a('number');
      expect(item.baseItem.quantity).to.be.a('number');
    });
    it('correctly transforms shipmentDocumentTotals', () => {
      const totals = o.shipmentDocumentTotals;
      expect(totals.totalDocumentAmount).to.be.a('number');
      expect(totals.packagesTotalQuantity).to.be.a('number');
      expect(totals.itemsTotalQuantity).to.be.a('number');
      expect(totals.shipmentTotals.totalMerchandiseAmount).to.be.a('number');
      expect(totals.shipmentTotals.totalAllowanceChargeAmount).to.be.a('number');
    });
    it('defrosts a packing list', () => {
      const issueDate = o.shipmentDocumentDate.Issue;
      const exFact = o.shipment.shipmentDate.ExFactory;
      expect(o.shipmentDocumentTotals.totalDocumentAmount).to.be.a('number');
      expect(issueDate).to.be.a('date');
      expect(issueDate.getMonth()).to.equal(7);
      expect(o.shipment.shipmentDate.ExFactory).to.be.a('date');
      expect(exFact.getMonth()).to.equal(7);
    });
  });

  it('creates an object that can be consumed by axus');
  //this is a test to make sure that creating this
  //across contexts is not an issue.
});
