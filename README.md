![axus](axus.jpg)

[![Build Status](https://travis-ci.org/AppXpress/axus.svg?branch=master)](https://travis-ci.org/AppXpress/axus)

`axus` is a unit test support framework, and a REPL for the AppXpress API.

[Providers are at the heart of AppXpress scripting](https://developer.gtnexus.com/platform/scripts). Really, you can't do anything without them. In order to provide developers with the best experience possible axus provides two implementations of the Providers -- [REST](#running-locally-against-the-rest-api) and [Local](#running-against-a-local-store). The REPL uses the REST implementation exclusively.

Rest Providers are great when you are just starting to develop, allowing you to query the REST API and get back real live data. Being able to do this allows you to spot mistakes early on and iterate quickly.

Local Providers really shine when you already know what your data looks like, or you want to build out some unit tests to ensure that your module stays rock solid as it grows.

# Acquiring axus

```bash
  npm install axus
```

# Node Vversion
This version of Axus was tested and confirmed working in node v19. Feel free to create an issue on the github if it's not working with an LTS version of node

# Running locally against the REST API
Your project will need a `appx.json` file in the project's root. This file contains the username, password, and dataKey needed to authenticate with the service, as well as the base url of the intended service. Here's an example `appx.json` file:

```json
{
  "username": "john.doe@gtnexus",
  "password": "secretcatchphrase",
  "dataKey": "36f71b26bca202c61973809143a58f7b12fe42a8",
  "url": "https://commerce-supportq.qa.gtnexus.com/rest/"
}
```

To import the RESTful Providers along with your module:

```js
let test-support = require('appx-test-support');
test-support.requireRest('../path/to/my/script');
```

# Running against a local store
Being able to hit the REST api is great, but not ideal for unit testing. We want our unit tests to run quickly. For this reason, AppX-Test-Support also exposes a `requireLocal`. Require local takes an extra argument, which is passed to the Providers to act as its own local data store.

## The Current Data Store Model and Limitations of the Local Store
`appx-test-support` currently lacks the ability to parse oql. To get around this limitation, the local store used to seed the local provider is expected to be in the following format:

```json
{
  "globalType": {
    "oql-string" : [

    ],
    "UID" : {

    },
    "another-UID" : {

    }
  },
  "anotherGlobalType": {
    "another oql-string" : [

    ]
  }
}
```

This format permits QueryProvider to resolve objects via OQL, and the PersistenceProvider to resolve obejcts by UID.

# Sample Unit Tests with axus
For this example, we will be using [mocha](https://mochajs.org/) as our unit testing framework.

Suppose we have a module named `MyTestModule`, and in that module we have the following code:

```js
var Query = (function() {

  var apiVersion = 310;

  function queryFor(type, oql) {
    return buildQueryPayLoad(
      Providers
      .getQueryProvider()
      .createQuery(type, apiVersion)
      .setOQL(oql).execute());
  }

  function buildQueryPayLoad(queryResult) {
    var hasResults = false;
    var payLoad = null;
    if (queryResult) {
      payLoad = queryResult.result || queryResult;
      hasResults = payLoad.length > 0;
    }
    return {
      'hasResults': hasResults,
      'payLoad': payLoad
    };
  }

  var emptyPayLoad = {
    'hasResults' : false,
    'payLoad': null
  };

  function setVersion(ver) {
    this.apiVersion = ver;
    return this;
  }

  //exports
  return {
    'emptyPayLoad':emptyPayLoad,
    'queryFor' : queryFor,
    'setApiVersion' : setVersion
  };
}());
```

A simple unit test for that code might look like:

```js
var expect = require('chai').expect;
var sync = require('synchronize');
var Query = require('axus')
  .requireLocal('../customer/gap/ParcelTracking', 'Query').seed({
    '$ParcelTrackerS1': {
      'parcelTrackingId=\'3790\'': [{
        id: 1
      }]
    }
  });

describe('Query', function() {
  describe('queryFor', function() {
    it('correctly returns some results', function(done) {
      sync.fiber(() => {
        var result = Query.queryFor('$MyGlobalType', 'someAttr=\'someVal\'');
        expect(result.hasResults).to.equal(true);
        done();
      });
    });
  });
});
```

A RESTful version:

```js
var expect = require('chai').expect;
var sync = require('synchronize');
var Query = require('axus')
  .requireRest('../modules/MyModule', 'Query');

describe.skip('Query', function() {
  describe('queryFor', function() {
    it('correctly returns some results', function(done) {
      this.timeout(10000); //give the REST service time to return
      sync.fiber(() => {
        var result = Query.queryFor('$MyGlobalType', 'someAttr=\'someVal\'');
        expect(result.hasResults).to.equal(true);
        done();
      });
    });
  });
});
```

# How it works
These details are abstracted away by the appx-test-support library, but in the interest of education...

AppXpress Modules are not _node-aware_, and are not ES6 compliant, there is no idea of a module system. As a result, we cannot `require` or `import` our appx modules in the traditional sense.

To be brief, we supply node a sandbox and a script to run in that sandbox. The sandbox is an object wrapping the global dependencies of the script. In our case, the sandbox merely contains the Providers, which are really the only globals available in the AppXpress platform. The context returned is bound to the  Providers instance that is present in the sandbox.
