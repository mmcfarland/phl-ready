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

        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        directionsDisplay.setMap(map);
    };

    N.Map.prototype.calculateRoute = function() {

        var start = $('#addr').val(),
            end = "Philadelphia International Airport",
            request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };

        this.directionsService.route(request, function(result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
              directionsDisplay.setDirections(result);
            }
        });
    };
}());
