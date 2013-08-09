(function(N) {
    N.Ready = function(opts) {
        var self = this;

        self.flight = opts.flight;
        self.direction = opts.direction; 
        self.server = 'http://54.235.132.110/';
        self.map = new Map();

        var socket = io.connect(server);

        socket.on('update', function(data) {
            console.log(data);
        });

        $('#go').click(self.map.calculateRoute);
        socket.emit('subscribe', {
            "flightNumber": flight, 
            "direction": direction
        });

        $.getJSON(server + 'number/' + flight + '?callback=?', function(status) {
            console.log(status);
        });

    
    };

}());
