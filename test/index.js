var tape = require("tape"),
    Record = require("..");


var TestRecord = Record({
    a: null,
    b: null
}, "TestRecord");


tape("Record() should create new Record from passed arguments", function(assert) {
    var Test0 = Record({
            a: null
        }),
        Test1 = Record({
            a: null
        }, "Test1"),
        instanceTest0 = new Test0(),
        instanceTest1 = new Test1();

    assert.equal(instanceTest0 instanceof Record, true);
    assert.equal(instanceTest1 instanceof Record, true);
    assert.equal(Test1.__name, "Test1");

    assert.end();
});

tape("Record.isRecord(value) should return true if the object is a Record", function(assert) {
    assert.equal(Record.isRecord(new TestRecord()), true);
    assert.equal(Record.isRecord({}), false);

    assert.end();
});

tape("Record get(key : Any) should return element where key equals passed key", function(assert) {
    var hashMap = new TestRecord({
        a: 0,
        b: 1
    });

    assert.equal(hashMap.get("a"), 0);
    assert.equal(hashMap.get("b"), 1);

    assert.end();
});

tape("Record has(key : Any) should return if Record has an element where key equals passed key", function(assert) {
    var hashMap = new TestRecord({
        a: 0,
        b: 1
    });

    assert.equal(hashMap.has("a"), true);
    assert.equal(hashMap.has("b"), true);
    assert.equal(hashMap.has("c"), false);

    assert.end();
});

tape("Record set(key : Any, value : Any) should return a new Record with the updated element at key if value is not the same", function(assert) {
    var a = new TestRecord({
            a: 0,
            b: 1
        }),
        b = a.set("a", 1),
        c = b.set("b", 1);

    assert.equal(b.get("a"), 1);
    assert.equal(b, c);

    try {
        a.set("c", 1);
    } catch (e) {
        assert.equal(e.message,
            "Cannot set unknown key \"c\" on TestRecord",
            "should throw error if key not in Record"
        );
    }

    assert.end();
});

tape("Record remove(key : Any) should return new Record with the removed key", function(assert) {
    var a = new TestRecord({
            a: 0,
            b: 1
        }),
        b = a.remove("a"),
        c = b.remove("b");

    assert.equal(b.get("a"), undefined);
    assert.equal(c.get("b"), undefined);

    assert.end();
});

tape("Record static equal(a : Record, b : Record) should return a deep equals of hashMap a and b", function(assert) {
    assert.equal(TestRecord.equal(new TestRecord({
        a: 0,
        b: 1
    }), new TestRecord({
        a: 0,
        b: 1
    })), true);
    assert.equal(TestRecord.equal(new TestRecord({
        a: 1,
        b: 2
    }), new TestRecord({
        a: 0,
        b: 1
    })), false);
    assert.end();
});

tape("Record iterator([reverse = false : Boolean]) (reverse = false) should return Iterator starting from the beginning", function(assert) {
    var a = new TestRecord({
            a: 0,
            b: 1
        }),
        it = a.iterator();

    assert.deepEqual(it.next().value, ["a", 0]);
    assert.deepEqual(it.next().value, ["b", 1]);
    assert.equal(it.next().done, true);

    assert.end();
});

tape("Record iterator([reverse = true : Boolean]) should return Iterator starting from the end", function(assert) {
    var a = new TestRecord({
            a: 0,
            b: 1
        }),
        it = a.iterator(true);

    assert.deepEqual(it.next().value, ["b", 1]);
    assert.deepEqual(it.next().value, ["a", 0]);
    assert.equal(it.next().done, true);

    assert.end();
});

tape("Record every(callback[, thisArg])", function(assert) {
    assert.equals(
        new TestRecord({
            a: "a",
            b: "b"
        }).every(function(value, key) {
            return value === key;
        }),
        true
    );
    assert.equals(
        new TestRecord({
            a: "a",
            b: "c"
        }).every(function(value, key) {
            return value === key;
        }),
        false
    );
    assert.end();
});

tape("Record filter(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        new TestRecord({
            a: "a",
            b: "b"
        }).filter(function(value) {
            return value === "b";
        }).toArray(), ["b", "b"]
    );
    assert.end();
});

tape("Record forEach(callback[, thisArg])", function(assert) {
    var count = 0,
        keys = [];

    new TestRecord({
        a: "a",
        b: "b"
    }).forEach(function(value, key) {
        keys[keys.length] = key;
        count += 1;
    });
    assert.deepEquals(keys, ["a", "b"]);
    assert.equals(count, 2);

    count = 0;
    keys.length = 0;
    new TestRecord({
        a: "a",
        b: "b"
    }).forEach(function(value, key) {
        keys[keys.length] = key;
        count += 1;
        if (value === 1) {
            return false;
        }
    });
    assert.deepEquals(keys, ["a", "b"]);
    assert.equals(count, 2);

    assert.end();
});

tape("Record forEachRight(callback[, thisArg])", function(assert) {
    var count = 0,
        keys = [];

    new TestRecord({
        a: "a",
        b: "b"
    }).forEachRight(function(value, key) {
        keys[keys.length] = key;
        count += 1;
    });
    assert.deepEquals(keys, ["b", "a"]);
    assert.equals(count, 2);

    count = 0;
    keys.length = 0;
    new TestRecord({
        a: "a",
        b: "b"
    }).forEachRight(function(value, key) {
        keys[keys.length] = key;
        count += 1;
        if (value === 1) {
            return false;
        }
    });
    assert.deepEquals(keys, ["b", "a"]);
    assert.equals(count, 2);

    assert.end();
});

tape("Record map(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        new TestRecord({
            a: "a",
            b: "b"
        }).map(function(value, key) {
            return value + key;
        }).toArray(), ["a", "aa", "b", "bb"]
    );
    assert.end();
});

tape("Record reduce(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        new TestRecord({
            a: "a",
            b: "b"
        }).reduce(function(currentValue, value) {
            return currentValue + value;
        }),
        "ab"
    );
    assert.end();
});

tape("Record reduceRight(callback[, thisArg])", function(assert) {
    assert.deepEquals(
        new TestRecord({
            a: "a",
            b: "b"
        }).reduceRight(function(currentValue, value) {
            return currentValue + value;
        }),
        "ba"
    );
    assert.end();
});

tape("Record some(callback[, thisArg])", function(assert) {
    assert.equals(
        new TestRecord({
            a: "a",
            b: "b"
        }).some(function(value) {
            return value === "b";
        }),
        true
    );
    assert.equals(
        new TestRecord({
            a: "a",
            b: "b"
        }).some(function(value) {
            return value === "c";
        }),
        false
    );
    assert.end();
});

tape("Record join([separator = \", \", [keyValueSeparator = \": \"]]) should join all elements of an Record into a String", function(assert) {
    var hashMap = new TestRecord({
        a: 0,
        b: 1
    });

    assert.equal(hashMap.join(), "a: 0, b: 1");
    assert.equal(hashMap.join(" "), "a: 0 b: 1");
    assert.equal(hashMap.join(", ", " => "), "a => 0, b => 1");

    assert.end();
});

tape("Record toString() should return toString representation of Record", function(assert) {
    assert.equal((new TestRecord({
        a: 0,
        b: 1
    })).toString(), "TestRecord {a: 0, b: 1}");
    assert.end();
});