'use strict';

//to give last a unique value initially
//function is a reference value in javascript and only equals itself
//this is done here to support
//1. undefined as a valid scope property being watched
//2. give newValue as the oldValue first time wacther is called
function initialVal() {}

function Scope() {
    this.$$watchers = [];
    this.$$lastDirtyWatcher = null;
}

Scope.prototype.$watch = function(watchFn, listenerFn) {
    this.$$watchers.push({
        watchFn: watchFn,
        listenerFn: listenerFn || function() {},
        last: initialVal
    });
};

Scope.prototype.$digest = function() {
    var dirty;
    var ttl = 10;
    this.$$lastDirtyWatcher = null;
    do {
        dirty = this.$digestOnce();
    } while (dirty && (--ttl > 0));

    if (ttl === 0 && dirty) {
        throw new Error('Max iterations reached for digest loop.');
    }
};

Scope.prototype.$digestOnce = function() {
    var dirty = false;
    _.forEach(this.$$watchers, function(watcher) {
        var newVal = watcher.watchFn(this);
        var oldVal = watcher.last;
        if (newVal !== oldVal) {
            watcher.last = newVal;
            watcher.listenerFn(newVal, (oldVal === initialVal ? newVal : oldVal), this);
            dirty = true;
            this.$$lastDirtyWatcher = watcher;
        } else if (this.$$lastDirtyWatcher === watcher) {
            return false;
        }
    }, this);
    return dirty;
};

