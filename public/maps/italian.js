var map, infoWindow, service;

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
            keyword: 'italian',
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


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        results.forEach((place) => {
            createMarker(place, map, service, infoWindow);
        })
    }
}

const createMarker = (place) => {
    const placeLocation = place.geometry.location;
    const marker = new google.maps.Marker({
        map : map,
        position: placeLocation
    })
    
    const request = { reference: place.reference };
    
    service.getDetails(request, (details) => {

        if (!details) {
            google.maps.event.addListener(marker, 'click', () => {
                infoWindow.setContent('<span style="padding: 0px; text-align:left" align="left"><h5>' + place.name + '&nbsp; &nbsp; ' + place.rating);
                infoWindow.setPosition(placeLocation);
                infoWindow.open(map);
            })
        }

        else {     
            google.maps.event.addListener(marker, 'click', () => {
                infoWindow.setContent('<span style="padding: 0px; text-align:left" align="left"><h5>' + place.name + '&nbsp; &nbsp; ' + place.rating 
                                    + '</h5><p>' + details.formatted_address + '<br />' + details.formatted_phone_number + '<br />' +  
                                    '<a  target="_blank" href=' + details.website + '>' + place.name + '</a></p>' ) ;
                infoWindow.setPosition(placeLocation);
                infoWindow.open(map);
            })
        }
    })
}