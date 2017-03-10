import React, { Component, PropTypes } from 'react';
import Marker from '../components/marker.jsx'

export default class UserMarker extends React.Component{

    render() {
        return(
            <Marker marker = {this.props.marker} map = {this.props.map}>
            </Marker>
        )
    }
}
