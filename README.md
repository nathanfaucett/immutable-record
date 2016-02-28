immutable record
=======

immutable persistent record for the browser and node.js

# Install
```bash
$ npm install git://github.com/nathanfaucett/immutable-record --save
```

# Usage
```javascript
var ImmutableRecord = require("immutable-record");


var User = ImmutableRecord({
    id: 0,
    name: null
});

var user = new User({
        id: 1,
        name: "username"
    });
```
