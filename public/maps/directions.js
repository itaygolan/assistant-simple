//import {handleLocationError, createMarker} from './helperFunctions';

var map, infoWindow;

function initMap() {
    map = new google.maps.Map(document.getElementById('picture-holder'), {
        zoom: 13
        });
    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
        var pos;
        navigator.geolocation.getCurrentPosition(async (position) => {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            const pointA = new google.maps.LatLng(pos.lat, pos.lng);

            service = new google.maps.places.PlacesService(map);
            const getServices = () => new Promise((resolve, reject) => {
                service.nearbySearch({
                    keyword: 'american',
                    location: pos,
                    radius: 5000,
                    type: ['restaurant']
                }, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        resolve(results);
                    } else {
                        reject(results);
                    }
                });
            });

            const results = await getServices();
            const bCoords = results[0].geometry.location
            const pointB = new google.maps.LatLng(bCoords.lat(), bCoords.lng());
            map.setCenter(pos);

            // Instantiate a directions service.
            directionsService = new google.maps.DirectionsService,
            directionsDisplay = new google.maps.DirectionsRenderer({
                map: map
            });

        // get route from A to B
        calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);

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