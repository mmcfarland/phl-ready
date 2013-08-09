(function(N) {
    N.Map = function(opts) {

        self = this;
        self.directionsService = new google.maps.DirectionsService();
        self.directionsDisplay = new google.maps.DirectionsRenderer();
        self.routeUrl = "http://www.mapquestapi.com/directions/v1/route?key=Fmjtd%7Cluub2561nq%2Caa%3Do5-9u8xuz&from={{from}}&to=39.875,-75.238";
        var mapOptions = {
             center: new google.maps.LatLng(39.875, -75.238),
             zoom: 13,
             mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        self.directionsDisplay.setMap(map);
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
