import React, { PropTypes } from 'react';
import { Random } from 'meteor/random';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor'
import Marker from '../ui/marker'


class GoogleMap extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        GoogleMaps.load(this.props.options || {key: Meteor.settings.public.google.api_key});
        this.timer = setInterval( () => this.createMap(), 100);
    }

    createMap(){
        if (this.props.loaded) {
            this.name = Random.id();
            GoogleMaps.create({
                name: this.name,
                element: this.container,
                options: this.props.mapOptions(),
            });
            this.props.onReady(this.name);
            clearInterval(this.timer);
        }
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
          <div className="map-container" ref={c => (this.container = c)}>
            {this.props.children}
          <div>{this.renderMarkers()}</div>
          </div>
        );
        }

    renderMarkers() {
        return this.props.buildings.map((building) =>(
            <Marker key = {Random.id()}
                 marker = {this.initBuildingMarker(
                     building.latitude,
                     building.longitude,
                 )}
                 map = {GoogleMaps.maps[this.name].instance}></Marker>
        ));
    }

    initBuildingMarker(lat, lng){
        let position = {lat: lat, lng:lng};
        let marker = new google.maps.Marker({
                position: position
            })
            return marker
        }
}



GoogleMap.propTypes = {
    loaded: PropTypes.bool.isRequired,
    onReady: PropTypes.func.isRequired,
    options: PropTypes.object,
    mapOptions: PropTypes.func.isRequired,
    children: PropTypes.node,
    buildings: PropTypes.array,
};

GoogleMapContainer = createContainer(
    (props) => {
        return{
            loaded: GoogleMaps.loaded(),
        };
    },
    GoogleMap,
);

export default GoogleMapContainer;
