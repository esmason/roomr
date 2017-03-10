import React, { Component, PropTypes } from 'react';
import Marker from '../components/marker.jsx'
import {userBuildingClick} from '../actions'

export default class BuildingMarker extends React.Component{

    componentDidMount () {
        if (typeof this.props !== "undefined") {
        const infowindow = new google.maps.InfoWindow({
          content: this.props.name + ", # free rooms: " + this.props.rooms.length
        });
        this.props.marker.addListener('click', (event) => {
            infowindow.open(this.props.marker.map, this.props.marker);
        })
    }
}

    render() {
        return(
            <Marker marker = {this.props.marker} map = {this.props.map}>
            </Marker>
        )
    }
}
