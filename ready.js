(function(N) {
    N.Ready = function(opts) {
        var self = this;

        $('#faq').popover({
            title: 'What is this?',
            content: 'This is a demonstration app using new real-time flight data from the airport.  Enter your flight and address and it will monitor travel times to the airport and flight updates to alert you when you need to leave.',
            placement: 'bottom'
        }); 
        self.server = 'http://54.235.132.110/';
        self.map = new Map();

        var socket = io.connect(self.server);

        socket.on('update', function(data) {
            if (self.flight && data) {
                self.flight.set(data);
            }
        });

        self.map.on('route-time-update', function(route) {
            $('#addr').val(route.start_address);
            self.flight.set('travelTime', route.duration.value / 60);
        });

        $('#go').click(function() {
            self.fn = $('#flight-num').val();
            if ($('#addr').val() === "") {
                alert("Please enter both a flight # and your starting location");
                return;
            }

            $.getJSON(self.server + 'number/' + self.fn + '?callback=?', function(status) {
                if (status.length === 0) {
                    alert("Sorry, couldn't find that flight. Make sure you use just the number portion of the flight.");
                    return;
                }
                if (status.length > 1) {
                    if (self.chooser) self.chooser.undelegateEvents();
                    self.flights = new Flights(status),
                    self.chooser = new FlightChooser({
                        collection: self.flights,
                        $list: $('.modal-body div')
                    }); 

                    self.chooser.on('selected', watchFlight, this);
                } else {
                    watchFlight(status[0]);
                }

                function watchFlight(fs) {
                    self.flight = new Flight(fs);
                    self.flightStatus = new FlightStatus({ model: self.flight });
                    self.flightProgress = new FlightProgress({
                        model: self.flight, id: '.progress-bar'
                    });
                    self.map.calculateRoute();

                    socket.emit('subscribe', {
                        "flightNumber": self.fn, 
                        "direction": fs.direction
                    });
                }
            });
        });
    };
}(this));
