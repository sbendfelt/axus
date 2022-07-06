const expect = require('chai').expect;

const ConnectionParams = require('../../lib/connection/connection-params');

describe('ConnectionParams', () => {
    describe('validate', () => {
        it('does not throw on correct params obj', () => {
            const params = {
                username: 'John',
                password: '...',
                dataKey: '<datakey>',
                url: 'https://commerce-demo.gtnexus.com/rest/'
            };
            ConnectionParams.validate(params);
        });
        it('throws error when params is missing value', () => {
          const params = {
              password: '...',
              dataKey: '<datakey>',
              url: 'https://commerce-demo.gtnexus.com/rest/'
          };
          const validFn = ConnectionParams.validate.bind(null, params);
          expect(validFn).to.throw(/appx\.config is missing the following:/);
        });
    });
});
