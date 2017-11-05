var ImmutableHashMap = require("@nathanfaucett/immutable-hash_map"),
    defineProperty = require("@nathanfaucett/define_property"),
    inherits = require("@nathanfaucett/inherits"),
    keys = require("@nathanfaucett/keys"),
    has = require("@nathanfaucett/has"),
    isString = require("@nathanfaucett/is_string"),
    freeze = require("@nathanfaucett/freeze");


var INTERNAL_CREATE = {},

    ITERATOR_SYMBOL = typeof(Symbol) === "function" ? Symbol.iterator : false,

    RECORD_ID = 0,
    IS_RECORD = "__ImmutableRecord__",

    RecordPrototype;


module.exports = Record;


function Record(defaultProps, name) {
    var id = RECORD_ID++,

        defaultName = name || ("RecordType" + id),
        defaultKeys = freeze(keys(defaultProps)),

        LOCAL_INTERNAL_CREATE = INTERNAL_CREATE,
        EMPTY_MAP = ImmutableHashMap.of(defaultProps),

        IS_RECORD_TYPE = "__ImmutableRecord-" + id + "__",

        RecordTypePrototype;


    function RecordType(value) {
        if (value === LOCAL_INTERNAL_CREATE) {
            return this;
        } else {
            if (value) {
                this._map = ImmutableHashMap.of(Record_createProps(defaultProps, value, defaultKeys));
            } else {
                this._map = EMPTY_MAP;
            }
            return freeze(this);
        }
    }
    inherits(RecordType, Record);
    RecordTypePrototype = RecordType.prototype;

    freeze(defaultProps);

    RecordType.EMPTY = freeze(new RecordType());

    RecordType.name = RecordType._name = RecordTypePrototype.name = defaultName;
    RecordTypePrototype._keys = defaultKeys;
    RecordTypePrototype._defaultProps = defaultProps;

    RecordType.fromObject = function(object) {
        return new RecordType(object);
    };
    RecordType.fromJSON = RecordType.fromObject;

    function isRecordType(value) {
        return !!(value && value[IS_RECORD_TYPE]);
    }
    if (isString(name)) {
        RecordType["is" + name] = isRecordType;
    }
    defineProperty(RecordTypePrototype, IS_RECORD, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: true
    });
    defineProperty(RecordTypePrototype, IS_RECORD_TYPE, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: true
    });

    return RecordType;
}
RecordPrototype = Record.prototype;

function isRecord(value) {
    return !!(value && value[IS_RECORD]);
}

Record.isRecord = isRecord;

defineProperty(RecordPrototype, IS_RECORD, {
    configurable: false,
    enumerable: false,
    writable: false,
    value: true
});

RecordPrototype.size = function() {
    return this._map._size;
};

if (defineProperty.hasGettersSetters) {
    defineProperty(RecordPrototype, "length", {
        get: RecordPrototype.size
    });
}

RecordPrototype.has = function(key) {
    return has(this._defaultProps, key);
};

RecordPrototype.get = function(key, notSetValue) {
    return this._map.get(key, notSetValue);
};

RecordPrototype.set = function(key, value) {
    var map, newMap;

    if (!has(this._defaultProps, key)) {
        throw new Error("Cannot set unknown key \"" + key + "\" on " + this.name);
    } else {
        map = this._map;
        newMap = map.set(key, value);

        if (newMap !== map) {
            return Record_createRecord(this, newMap);
        } else {
            return this;
        }
    }
};

RecordPrototype.remove = function(key) {
    var map, newMap;

    if (!has(this._defaultProps, key)) {
        throw new Error("Cannot remove unknown key \"" + key + "\" from " + this.name);
    } else {
        map = this._map;
        newMap = map.remove(key);

        if (newMap !== map) {
            return Record_createRecord(this, newMap);
        } else {
            return this;
        }
    }
};

RecordPrototype.join = function(separator, keyValueSeparator) {
    return this._map.join(separator, keyValueSeparator);
};

RecordPrototype.toString = function() {
    return this.name + " {" + this.join() + "}";
};

Record.equal = function(a, b) {
    return ImmutableHashMap.equal(a._map, b._map);
};

RecordPrototype.equal = function(other) {
    return Record.equal(this, other);
};

function RecordIteratorValue(done, value) {
    this.done = done;
    this.value = value;
}

function RecordIterator(next) {
    this.next = next;
}

function Record_iterator(_this) {
    var map = _this._map;
    keys = _this._keys,
        index = 0,
        length = keys.length;

    return new RecordIterator(function next() {
        var key;

        if (index < length) {
            key = keys[index];
            index += 1;
            return new RecordIteratorValue(false, [key, map.get(key)]);
        } else {
            return new RecordIteratorValue(true, []);
        }
    });
}

function Record_iteratorReverse(_this) {
    var map = _this._map,
        keys = _this._keys,
        index = keys.length;

    return new RecordIterator(function next() {
        var key;

        if (index > 0) {
            index -= 1;
            key = keys[index];
            return new RecordIteratorValue(false, [key, map.get(key)]);
        } else {
            return new RecordIteratorValue(true, []);
        }
    });
}

RecordPrototype.iterator = function(reverse) {
    if (!reverse) {
        return Record_iterator(this);
    } else {
        return Record_iteratorReverse(this);
    }
};

if (ITERATOR_SYMBOL) {
    RecordPrototype[ITERATOR_SYMBOL] = RecordPrototype.iterator;
}

RecordPrototype.every = function(callback, thisArg) {
    return this._map.every(callback, thisArg);
};

RecordPrototype.filter = function(callback, thisArg) {
    return Record_createRecord(this, this._map.filter(callback, thisArg));
};

RecordPrototype.forEach = function(callback, thisArg) {
    this._map.forEach(callback, thisArg);
    return this;
};
RecordPrototype.each = RecordPrototype.forEach;

RecordPrototype.forEachRight = function(callback, thisArg) {
    this._map.forEachRight(callback, thisArg);
    return this;
};
RecordPrototype.eachRight = RecordPrototype.forEachRight;

RecordPrototype.map = function(callback, thisArg) {
    return Record_createRecord(this, this._map.map(callback, thisArg));
};
RecordPrototype.reduce = function(callback, initialValue, thisArg) {
    return this._map.reduce(callback, initialValue, thisArg);
};
RecordPrototype.reduceRight = function(callback, initialValue, thisArg) {
    return this._map.reduceRight(callback, initialValue, thisArg);
};
RecordPrototype.some = function(callback, thisArg) {
    return this._map.some(callback, thisArg);
};

RecordPrototype.toArray = function() {
    return this._map.toArray();
};
RecordPrototype.toObject = function() {
    return this._map.toObject();
};

RecordPrototype.toJSON = RecordPrototype.toObject;

function Record_createRecord(_this, map) {
    var record = new _this.constructor(INTERNAL_CREATE);
    record._map = map;
    return freeze(record);
}

function Record_createProps(defaultProps, props, keys) {
    var localHas = has,
        newProps = {},
        i = -1,
        il = keys.length - 1,
        key;

    while (i++ < il) {
        key = keys[i];
        newProps[key] = localHas(props, key) ? props[key] : defaultProps[key];
    }

    return newProps;
}