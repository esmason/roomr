import React from 'react';
import GoogleMap from '../components/google-map';
import { connect } from 'react-redux'
import {availableBuildings} from '../../minimongo/available-buildings.js'
import {userDropPin, onSubscribed} from '../actions'

const getBuildings = (displayNearestBuilding, userLocation) => {
    if (displayNearestBuilding) {
        return ["test"] //availableBuildings.find({}).fetch()[0]
    }
    else {
        return []
    }
}

const mapDispatchToProps = {
    onClick: userDropPin,
    onSubscribed: onSubscribed,
}

const mapStateToProps = (state) => ({
    displayNearestBuilding: state.displayNearestBuilding,
    userLocation: state.userLocation,
    mapOptions: handleMapOptions,
    subscribed: state.isSubscribed,
})

const handleMapOptions = () => {
    return({
        center: new google.maps.LatLng(49.2606, -123.2460),
        zoom: 16,
    });
}

const MyMap = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GoogleMap)

export default MyMap;
