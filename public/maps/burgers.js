var map, infoWindow, service;

function initMap() {
    map = new google.maps.Map(document.getElementById('picture-holder'), {
        zoom: 13
        });
    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
        var pos;
        navigator.geolocation.getCurrentPosition(function(position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                keyword: 'american',
                location: pos,
                radius: 5000,
                type: ['restaurant']
            }, callback);

            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter(), map);
        });
        } 
    else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

initMap();