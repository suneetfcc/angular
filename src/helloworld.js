var app = (function() {

    function sayHello(to) {
        return _.template('Hello, <%= name%>!')({name: to});
    }
    xyterkjdd;
    return {
        sayHello: sayHello
    };
})();
