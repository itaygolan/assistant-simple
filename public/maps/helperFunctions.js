
function handleLocationError (browserHasGeolocation, infoWindow, pos, map) {
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

function createMarker (place, map, service, infoWindow) {
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

function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
    directionsService.route({
      origin: pointA,
      destination: pointB,
      travelMode: google.maps.TravelMode.DRIVING
    }, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }