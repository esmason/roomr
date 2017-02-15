import React from 'react';
import GoogleMap from './lib/GoogleMap';

function handleMapOptions() {
  return {
    center: new google.maps.LatLng(49.2606, -123.2460),
    zoom: 16,
  };
}

function handleOnReady(name) {
  GoogleMaps.ready(name, map => {
    map.instance["marker"] = null;
    google.maps.event.addListener(map.instance, "click", (event) => clickListener(event, map) );
  //  getDirections(map, "Life sciences centre, UBC, Vancouver", "ICICS, UBC, Vancouver");
  });

}

function clickListener(event, map) {

if(map.instance.marker){
  map.instance.marker.setMap(null)
}
const latLng = event.latLng;
map.instance.marker = new google.maps.Marker({
                                  position: latLng,
                                  map: map.instance,
                              });
}

function getDirections(map, start, dest){
  var directionsService = new google.maps.DirectionsService();
  var request = {
    destination: start,
    origin: dest,
    travelMode: 'DRIVING'
  };

  var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map.instance
      });
  directionsService.route(request, function(response, status) {
    if (status == 'OK') {
      // Display the route on the map.
      directionsDisplay.setDirections(response);
    }
  });

}

export default class MyMap extends React.Component {
  render() {
  return (
    <GoogleMap onReady={handleOnReady} mapOptions={handleMapOptions}>
      Loading!
    </GoogleMap>
  );
}
}
