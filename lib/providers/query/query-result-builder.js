class QueryResultBuilder {
    constructor() {
      throw new Error('Illegal state. Cannot instantiate QueryResultBuilder.');
    }

    static buildResultSet(result) {
        let emptyResult = {
            hasResults: false,
            results: undefined
        };
        if (!result) {
            return emptyResult;
        }
        if (!Array.isArray(result)) {
            result = [result];
        }
        let resultInfo = {
            'count': result.length,
            'hasMore': false,
            'offset': 0,
            'firstRowNumber': result.length > 0 ? 1 : 0,
            'estimatedTotalCount': result.length
        };
        return {
            resultInfo: resultInfo,
            result: result
        };
    }
}

module.exports = QueryResultBuilder;
