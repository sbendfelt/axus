/*jshint expr: true*/
let expect = require('chai').expect;
let QueryResultBuilder = require('../../lib/providers/query/query-result-builder');

describe('Query Result Builder', () => {
    let result = ['fraggle', 'rock'];

    it('wraps null results as empty', (done) => {
        let emptyResult1 = QueryResultBuilder.buildResultSet();
        let emptyResult2 = QueryResultBuilder.buildResultSet([]);
        expect(emptyResult1).to.deep.equal({
            'hasResults': false,
            'results': undefined
        });
        expect(emptyResult2).to.deep.equal({
            'resultInfo': {
                'count': 0,
                'hasMore': false,
                'offset': 0,
                'firstRowNumber': 0,
                'estimatedTotalCount': 0
            },
            'result': []
        });
        done();
    });
    it('wraps results as needed', (done) => {
        let wrappedResult = QueryResultBuilder.buildResultSet(result);
        expect(wrappedResult).to.deep.equal({
          'resultInfo': {
              'count': 2,
              'hasMore': false,
              'offset': 0,
              'firstRowNumber': 1,
              'estimatedTotalCount': 2
            },
            'result': ['fraggle', 'rock']
        });
        done();
    });
});
