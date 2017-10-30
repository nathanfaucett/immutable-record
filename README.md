Immutable Record
=======

Immutable persistent record for the browser and node.js

# Install using npm
```bash
$ npm install @nathanfaucett/immutable-record --save
```
# Install using yarn
```bash
$ yarn add @nathanfaucett/immutable-record --save
```

# Example Usage
```javascript
var ImmutableRecord = require("@nathanfaucett/immutable-record");


var User = ImmutableRecord({
    id: 0,
    name: null
}, "User");

var user = new User({
    id: 1,
    name: "username"
});
```

# Docs

## Members

#### length -> Number
    returns size of Record, only available if Object.defineProperty is supported


## Static Functions

#### Record.isRecord(value: Any) -> Boolean
    returns true if value is a hash map else false

#### Record.of(...values: Array<Any>) -> Record
    creates Record from passed values same as new Record(...values: Array<Any>)

#### Record.equal(a: Record, b: Record) -> Boolean
    compares hash maps by values


## Functions

#### size() -> Number
    returns size of Record

#### get(key: Any) -> Any
    returns value at key

#### has(key: Any) -> Boolean
    returns true if hash map contains key

#### set(key: Any, value: Any) -> Record
    returns new Record if value at key is not set or different

#### remove(key: Any) -> Record
    returns new Record without the value at key

#### iterator([reverse = false: Boolean]) -> Iterator
    returns Iterator

#### toArray() -> Array<[Any, Any]>
    returns Record elements in an Array

#### toObject() -> Object<String, Any>
    returns Record elements in an Object, keys should be primitives or some key value pairs will be lost

#### join([separator = " "]) -> String
    join all elements of an Record into a String

#### toString() -> String
    String representation of Record

#### equals(other: Record) -> Boolean
    compares this hash map to other hash map by values

#### every, filter, forEach, forEachRight, map, reduce, reduceRight, some
    some common methods
