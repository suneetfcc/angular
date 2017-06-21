/* global Scope:false */
'use strict';

describe('Scope', function() {

    it('can be used a regular javascript object', function() {

        var scope =  new Scope();
        scope.someProperty = 'someProperty';
        expect(scope.someProperty).toBe('someProperty');
    });

    describe('$digest()', function() {

        var scope;
        beforeEach(function() {
            scope = new Scope();
        });

        it('calls listener of watcher', function() {
            var watchFn = function() {
                return 'expr';
            };
            var listenerFn =  jasmine.createSpy('listenerFn');
            scope.$watch(watchFn, listenerFn);
            scope.$digest();
            expect(listenerFn).toHaveBeenCalled();
        });

        it('calls watch function with scope as argument', function() {
            var watchFn = jasmine.createSpy();
            var listenerFn = function() {};
            scope.$watch(watchFn, listenerFn);
            scope.$digest();
            expect(watchFn).toHaveBeenCalledWith(scope);
        });

        it('calls listenter when watched value changes', function() {
            scope.count = 0;
            scope.someProperty = 'old';

            scope.$watch(function(scope) {
                return scope.someProperty;
            }, function(newVal, oldVal, scope) {
                scope.count++;
            });

            scope.$digest();
            expect(scope.count).toBe(1);

            scope.$digest();
            expect(scope.count).toBe(1);

            scope.someProperty = 'new';
            expect(scope.count).toBe(1);

            scope.$digest();
            expect(scope.count).toBe(2);
        });

        it('calls listener when watched value is undefined', function() {
            scope.count = 0;
            scope.$watch(function(scope) {
                return scope.someProperty;
            }, function(newVal, oldVal, scope) {
                scope.count++;
            });
            scope.$digest();
            expect(scope.count).toBe(1);
        });

        it('calls listener with new value as old value the first time', function() {
            scope.someProperty = 'val';
            var firstOldValue;
            scope.$watch(function(scope) {
                return scope.someProperty;
            }, function(newVal, oldVal, scope) {
                firstOldValue = oldVal;
            });
            scope.$digest();
            expect(firstOldValue).toBe('val');
        });

        it('can have wactchers without listeners', function() {
            var watchFn = jasmine.createSpy();
            scope.$watch(watchFn);
            scope.$digest();
            expect(watchFn).toHaveBeenCalled();
        });

        it('triggers chained watchers in the same digest', function() {
            scope.name = 'jane';

            scope.$watch(function(scope) {
                return scope.nameUpper;
            }, function(newVal, oldVal, scope) {
                if (newVal) {
                    scope.initial = newVal.substring(0,1) + '.';
                }
            });

            scope.$watch(function(scope) {
                return scope.name;
            }, function(newVal, oldVal, scope) {
                scope.nameUpper = newVal.toUpperCase();
            });

            scope.$digest();
            expect(scope.initial).toBe('J.');

        });

        it('gives up on the watches after 10 iterations', function() {
            scope.prop1 = 0;
            scope.prop2 = 0;

            scope.$watch(function(scope) {
                return scope.prop1;
            }, function(newVal, oldVal, scope) {
                scope.prop2++;
            });

            scope.$watch(function(scope) {
                return scope.prop2;
            }, function(newVal, oldVal, scope) {
                scope.prop1++;
            });

            expect(function() { scope.$digest(); }).toThrow();
        });

        it('ends the digest when the last watch is clean', function() {
            scope.props = new Array(100);
            var calledTimes = 0;
            _.times(100, function(index) {
                scope.$watch(function(scope) {
                    calledTimes++;
                    return scope.props[index];
                }, function() {});
            });
            scope.$digest();
            expect(calledTimes).toBe(200);
            scope.props[2] = 'x';
            scope.$digest();
            expect(calledTimes).toBe(303);
        });

        afterEach(function() {
            scope = null;
        });
    });
});
