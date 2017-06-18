/* global sayHello:false */

'use strict';

describe('helloworld', function () {

    it('sayHello() should say hello world', function() {
        expect(sayHello('World')).toBe('Hello, World!');
    });

});
