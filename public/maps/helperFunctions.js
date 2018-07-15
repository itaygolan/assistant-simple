
function handleLocationError (browserHasGeolocation, infoWindow, pos, map) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
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

export { handleLocationError, createMarker };