/*jshint expr: true*/
const expect = require('chai').expect;
const ImmutableDefroster = require('../../lib/type/defroster');
const axus = require('../../lib/appx-test-support');

describe('ImmutableDefroster', () => {
    const de = new ImmutableDefroster();

    describe('defrosting a packing list', () => {
        const o = de.defrostPath('./test/resources/pkm.json');
        it('copied the __metadata', () => {
            expect(o.__metadata).to.be.ok;
            expect(o.__metadata.type).to.be.ok;
        });
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

    describe('defosting a shipping order', () => {
        const so = de.defrostPath('./test/resources/destinationSO2.json');
        it('transforms dates correctly', () => {
            expect(so.ETAPortOfDischargeDate).to.be.a('date');
        });
    });
    //this is a test to make sure that creating this
    //across contexts is not an issue.
    it('creates an object that can be consumed by axus', () => {
        const ctx = axus
            .requireLocal('./test/resources/vanilla/types-across-contexts.js')
            .seed();
        const so = de.defrostPath('./test/resources/destinationSO2.json');
        const portOfDischargeDate = so.ETAPortOfDischargeDate;
        expect(ctx.isDate(portOfDischargeDate)).to.be.true;
    });
});
