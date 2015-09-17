# AppX-Test-Support

## Running locally against the REST API

Your project will need a appx.json file in the projects root. This file contains the username, password, and dataKey needed to authenticate with the service, as well as the base url of the intended service.

To import the RESTful Providers along with your module:

```js
var test-support = require('appx-test-support');
test-support.requireRest('../path/to/my/script');
```

Node assumes all `IO` to be asynchronous. However, the AppXpress Providers operate
in a synchronous manner. AppX-Test-Support relies on [synchronize.js](http://alexeypetrushin.github.io/synchronize/docs/index.html)
in order to simulate a synchronous environment.

Any code relying on Providers.rest will need to be wrapped as such:

```js
var sync = require('synchronize');
sync.fiber(() => {
  //your code goes here
});
```

## Running against a local store

Being able to hit the REST api is great, but not ideal for unit testing. We want our unit tests to run quickly. For this reason, AppX-Test-Support also exposes a `requireLocal`. Require local takes an extra argument, which is passed to the Providers to act as its own local data store.

### The Current Data Store Model and Limitations of the Local Store

`appx-test-support` currently lacks the ability to parse oql. To get around this limitation, the local store used to seed the local provider is expected to be in the following format:

```json
{
  "globalType": {
    "oql-string" : [

    ]
  },
  "anotherGlobalType": {
    "another oql-string" : [

    ]
  },
  ...
}
```

# How it works

## Loading Scripts

These details are abstracted away by the appx-test-support library, but in the interest of education...

AppXpress Modules are not *node-aware*, and are not ES6 compliant, there is no idea of a module system.
As a result, we cannot `require` or `import` our appx modules in the traditional sense.

The [companion](https://github.com/rockgolem/companion) module does almost exactly what we need it to, with one caveat--companion doesn't always correctly resolve
paths when it is required from another dependency. You can check out my fork of companion and quick fix [here](https://github.com/jjdonov/companion).
