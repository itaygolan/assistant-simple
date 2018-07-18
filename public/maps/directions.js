//import {handleLocationError, createMarker} from './helperFunctions';

var map, infoWindow;

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
            let bCoords;

            fetch('/mapdata').then((res) => {
                res.text().then((data) => {
                    console.log(data);
                    bCoords = data;
                })
            });

            const pointB = new google.maps.LatLng(bCoords.lat, bCoords.lng);


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


initMap();