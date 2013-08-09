(function(N) {
    N.Ready = function(opts) {
        var self = this;

        self.server = 'http://54.235.132.110/';
        self.map = new Map();

        var Flight = Backbone.Model.extend({}),
            FlightV = Backbone.View.extend({
                initialize: function() {
                    this.model.on('change', this.render, this);
                },

                render: function() {
                    var t = _.template($('#template-flight').html());
                        ctx = this.model.toJSON();
                        landsAt = moment(ctx.scheduledDateTime),
                        landsIn = moment();
                    this.$el.html(t(ctx));
                    this.$el.appendTo('body');
                    return this;
                }
        });

        var socket = io.connect(self.server);

        socket.on('update', function(data) {
            console.log(data);
        });

        self.map.on('route-time-update', function(route) {
            $('#addr').val(route.start_address);
            self.flight.set('travelTime', route.duration.value);
            console.log(route);
        });

        $('#go').click(function() {
            self.fn = $('#flight-num').val();
            self.direction = $('#direction').val() || "Arrival";

            $.getJSON(self.server + 'number/' + self.fn + '?callback=?', function(status) {
                if (status.length > 0) {
                    self.flight = new Flight(status[0]);
                    self.flightv = new FlightV({ model: self.flight }).render();

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
