import React from 'react';
import GoogleMap from '../lib/google-map';

export default class MyMap extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <GoogleMap
                onReady = {this.handleOnReady.bind(this)}
                mapOptions = {this.handleMapOptions}
                userLocation = {this.props.userLocation}
                buildings = {this.props.buildings}
            >
                Loading!
            </GoogleMap>
        );
    }

    handleMapOptions() {
        return({
            center: new google.maps.LatLng(49.2606, -123.2460),
            zoom: 16,
        });
    }

    handleOnReady(name) {
        GoogleMaps.ready(name, map => {
            google.maps.event.addListener(map.instance, "click", (event) => this.props.onMapClick(event));
        });
    }

    getDirections(map, start, dest) {
        let directionsService = new google.maps.DirectionsService();
        let request = {
            destination: start,
            origin: dest,
            travelMode: 'WALKING'
        };

        let directionsDisplay = new google.maps.DirectionsRenderer({
            map: map.instance
        });

        directionsService.route(request, function(response, status) {
            if (status == 'OK') {
                // Display the route on the map.
                directionsDisplay.setDirections(response);
            }
        });
    }
}
