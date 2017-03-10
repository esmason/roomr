import React, { PropTypes } from 'react';
import { Random } from 'meteor/random';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor'
import BuildingMarker from '../containers/building-marker.jsx'
import UserMarker from '../containers/user-marker.jsx'
import {availableBuildings} from '../../minimongo/available-buildings.js'

class GoogleMap extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        GoogleMaps.load(this.props.options || {key: Meteor.settings.public.google.api_key});
        this.timer = setInterval( () => this.createMap(), 100);
    }

    createMap() {
        if (GoogleMaps.loaded()) {
            this.name = Random.id();
            GoogleMaps.create({
                name: this.name,
                element: this.container,
                options: this.props.mapOptions(),
            });
            GoogleMaps.ready(this.name, map => {
                google.maps.event.addListener(
                    map.instance,
                    "click",
                    (event) => this.onMapClick(event),
                );
            });
            clearInterval(this.timer);
        }
    }

    onMapClick(event) {
        this.props.onClick(event);
        Meteor.subscribe(
            "buildings",
            event.latLng.lat(),
            event.latLng.lng(),
            () => this.props.onSubscribed(event),
        )
    }

    componentWillUnmount() {
        if (GoogleMaps.maps[this.name]) {
            google.maps.event.clearInstanceListeners(
                GoogleMaps.maps[this.name].instance,
            );
            delete GoogleMaps.maps[this.name];
        }
    }

    render() {
        return (
            <div className = "map-container" ref = {c => (this.container = c)}>
                {this.props.children}
                <div>{this.renderUserLocation()}</div>
                <div>{this.renderBuildingMarkers()}</div>
            </div>
        );
    }


    renderUserLocation() {
        if (this.props.userLocation!=null) {
            return(
                <UserMarker key = {Random.id()}
                           marker = {this.initMarker(this.props.userLocation)}
                           map = {GoogleMaps.maps[this.name].instance}>
                       </UserMarker>)
        }
    }

    renderBuildingMarkers() {
        if (this.props.displayNearestBuilding){
           return availableBuildings.find({}).fetch()[0].buildings.map((building) =>(
            <BuildingMarker key = {Random.id()}
                    marker = {this.initMarker({
                            lat: building.latitude,
                            lng: building.longitude,
                        }
                    )}
                    map = {GoogleMaps.maps[this.name].instance}
                    name = {building.name}
                    rooms = {building.availableRooms}>
            </BuildingMarker>
        ));
    }
}

    initMarker(position) {
        return new google.maps.Marker({
            position: position
        })
    }
}

GoogleMap.propTypes = {
    onClick: PropTypes.func.isRequired,
    options: PropTypes.object,
    mapOptions: PropTypes.func.isRequired,
    children: PropTypes.node,
};



export default GoogleMap;
