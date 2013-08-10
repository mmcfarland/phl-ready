(function(N) {
    N.Ready = function(opts) {
        var self = this;

        self.server = 'http://54.235.132.110/';
        self.map = new Map();

        var socket = io.connect(self.server);

        socket.on('update', function(data) {
            if (self.flight && data) {
                self.flight.set(data);
                console.log(data);
            }
        });

        self.map.on('route-time-update', function(route) {
            $('#addr').val(route.start_address);
            self.flight.set('travelTime', route.duration.value / 60);
            console.log(route);
        });

        $('#go').click(function() {
            self.fn = $('#flight-num').val();
            self.direction = $('#direction').val() || "Arrival";

            $.getJSON(self.server + 'number/' + self.fn + '?callback=?', function(status) {
                if (status.length > 0) {
                    self.flight = new Flight(status[0]);
                    self.flightv = new FlightV({ model: self.flight });

                    self.map.calculateRoute();

                } else {
                    alert("Sorry, couldn't find that flight.");
                }
            });
        });

        socket.emit('subscribe', {
            "flightNumber": self.fn, 
            "direction": self.direction
        });


    
    };

}(this));
