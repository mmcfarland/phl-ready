(function(N) {
    N.Ready = function(opts) {
        var self = this;

        self.flight = opts.flight;
        self.direction = opts.direction; 
        self.server = 'http://54.235.132.110/';
        self.map = new Map();

        var socket = io.connect(self.server);

        socket.on('update', function(data) {
            console.log(data);
        });

        $('#go').click($.proxy(self.map.calculateRoute, self.map));
        socket.emit('subscribe', {
            "flightNumber": self.flight, 
            "direction": self.direction
        });

        $.getJSON(self.server + 'number/' + self.flight + '?callback=?', function(status) {
            console.log(status);
        });

    
    };

}(this));
