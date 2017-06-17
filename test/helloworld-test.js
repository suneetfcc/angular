describe('helloworld::', function () {

    it('sayHello: should say hello world', function() {
        expect(app.sayHello('World')).toBe('Hello, World!');
    });

});
