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

function MyMap() {
  return (
    <GoogleMap onReady={handleOnReady} mapOptions={handleMapOptions}>
      Loading!
    </GoogleMap>
  );
}

export default MyMap;
