//import {handleLocationError, createMarker} from './helperFunctions';

var map, infoWindow, service, allPlaces;
var locations = [];

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

            const pointA = new google.maps.LatLng(pos.lat, pos.lng);
            console.log(pointA);

            service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                keyword: 'american',
                location: pos,
                radius: 5000,
                type: ['restaurant']
            }, getOne);


            map.setCenter(pos);

            // Instantiate a directions service.
            directionsService = new google.maps.DirectionsService,
            directionsDisplay = new google.maps.DirectionsRenderer({
                map: map
            }),
                markerA = new google.maps.Marker({
                    position: pointA,
                    title: "point A",
                    label: "A",
                    map: map
            }),
                markerB = new google.maps.Marker({
                    position: pointB,
                    title: "point B",
                    label: "B",
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

function getOne(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        const place = results[0];
        const placeLocation = place.geometry.location;
        const pointB = new google.maps.LatLng(placeLocation.lat(), placeLocation.lng());
        console.log(pointB);
    }
}

initMap();