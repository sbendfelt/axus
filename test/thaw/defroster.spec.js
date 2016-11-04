const expect = require('chai').expect;
const Defroster = require('../../lib/thaw/defroster');

describe('Defroster', () => {
  it.only('seems to work', () => {
    const de = new Defroster();
    const o = de.thaw('./test/resources/pkm.json');

    expect(o.shipmentDocumentTotals.totalDocumentAmount).to.be.a('number');


    const issueDate = o.shipmentDocumentDate.Issue;
    expect(issueDate).to.be.a('date');
    expect(issueDate.getMonth()).to.equal(7);

    expect(o.shipment.shipmentDate.ExFactory).to.be.a('date');
    const exFact =   o.shipment.shipmentDate.ExFactory;
    expect(exFact.getMonth()).to.equal(7);
  });
  it('creates an object that can be consumed by axus');
  //this is a test to make sure that creating this
  //across contexts is not an issue.
});
