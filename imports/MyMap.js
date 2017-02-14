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
    const marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance,
    });
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
