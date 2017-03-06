import React from 'react';
import GoogleMap from '../lib/google-map';

export default class MyMap extends React.Component {
    constructor(props){
        super(props);
        this.clickListener = this.clickListener.bind(this);
    }

    render() {
        return (
            <GoogleMap
                onReady={this.handleOnReady.bind(this)}
                mapOptions={this.handleMapOptions}
                userLocation={this.props.userLocation}
                buildings = {this.props.buildings}
                >
                Loading!
            </GoogleMap>
        );
    }

    handleMapOptions() {
        return( {
            center: new google.maps.LatLng(49.2606, -123.2460),
            zoom: 16,
        });
    }

    handleOnReady(name) {
        GoogleMaps.ready(name, map => {
            map.instance["user_marker"] = null;
            map.instance["markers"] = [];
            google.maps.event.addListener(map.instance, "click", (event) => this.clickListener(event, map));
            //  getDirections(map, "Life sciences centre, UBC, Vancouver", "ICICS, UBC, Vancouver");
        });
    }

    clickListener(event, map) {
        if(map.instance.user_marker != null){
            map.instance.user_marker.setMap(null)
        }
        map.instance.user_marker = new google.maps.Marker({
            position: event.latLng,
            map: map.instance,
        });
        this.props.onMapClick(event);
    }

    getDirections(map, start, dest){
        var directionsService = new google.maps.DirectionsService();
        var request = {
            destination: start,
            origin: dest,
            travelMode: 'WALKING'
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
}
