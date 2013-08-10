(function(N) {
    N.Map = function(opts) {

        self = this;
        self.directionsService = new google.maps.DirectionsService();
        self.directionsDisplay = new google.maps.DirectionsRenderer();

        var mapOptions = {
             center: new google.maps.LatLng(39.875, -75.238),
             zoom: 13,
             mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"),mapOptions),
            traffic = new google.maps.TrafficLayer();

        traffic.setMap(map);
        self.directionsDisplay.setMap(map);

        // Update the travel times ever minute
        setInterval(self.calculateRoute, 60 * 1000);
    };

    N.Map.prototype.calculateRoute = function() {

        var self = this,
            start = $('#addr').val(),
            end = "Philadelphia International Airport",
            request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };

        self.directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                self.directionsDisplay.setDirections(result);
                self.trigger('route-time-update', result.routes[0].legs[0]);
            }
        });
    };

    _.extend(N.Map.prototype, Backbone.Events);

}(this));
