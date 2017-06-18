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

        afterEach(function() {
            scope = null;
        });
    });
});
