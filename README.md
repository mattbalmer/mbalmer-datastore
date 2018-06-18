# Datastore

A datastore module by Matt Balmer.

Can be used fine with either plain JavaScript, or with TypeScript for additional benefits.

The documentation below will be marked with TypeScript.

## Installation

`npm i --save mbalmer-datastore`

Import with:

`import { Datastore } from 'mbalmer-datastore';`
or
`const { Datastore } = require('mbalmer-datastore');`

## Usage

### Instantiating New Datastore

To create a new datastore:

    const datastore = new Datastore();

The default data will be an empty object `{}`. If you have data to default to, or an interface, the following will work:

    const datastore = new Datastore<YourInterface>({
      your: 'defaultObject',
      foo: {
        bar: 'hello',
      },
    });

### Functions

#### exists(path)

Returns a boolean if the given path exists.

#### get(path, \[default\])

Returns the value at a given path, or default if it does not exist.

#### set(path, value)

Sets the value at a given path.

#### update(path, value, \[force\])

Updates the value at a given path, as long as it exists. Throws an error if it does not.

If the `force` flag is true, it will call `set()` with the given parameters.

#### insert(path, value, \[pos\])

Inserts a value into an array field. If the path specified is not an array, an error will be thrown.

A callback for an `insert` operation will also contain the delta (the value given in the insert() call), and the position inserted at.

#### subscribe(callback)

There are several ways to call subscribe:

`datastore.subscribe(callback)`
`datastore.subscribe(path, callback)`
`datastore.subscribe(path, operation, callback)`

Where `path` and `operation` are optional arguments that server to filter which operations call the given callback.

For example, if called with `datastore.subscribe('users', 'insert', callback)`, operations setting other paths, or setting the same path but with a different operation, would not trigger the callback.