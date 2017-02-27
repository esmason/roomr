import React, { PropTypes } from 'react';
import { Random } from 'meteor/random';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor'
import {Buildings} from '../database/buildings'


class GoogleMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            markers: []
        }
    }

  componentDidMount() {
    GoogleMaps.load(this.props.options || {key: Meteor.settings.public.google.api_key});
    this.timer = setInterval( () => this.createMap(), 100);
  }

  componentDidUpdate() {
    if (this.props.buildings){
        for (let i = 0; i < this.state.markers.length; i++){
            this.state.markers[i].setMap(null);
        }
        for (let i = 0; i < this.props.buildings.length; i++) {
            building = this.props.buildings[i];
            let latLng = {lat: building.latitude, lng: building.longitude};
            let marker = new google.maps.Marker({
               position: latLng,
               map: GoogleMaps.maps[this.name].instance,
           });
           this.state.markers.push(marker);
       }
    }
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
      </div>
    );
  }
};

GoogleMap.propTypes = {
  loaded: PropTypes.bool.isRequired,
  onReady: PropTypes.func.isRequired,
  options: PropTypes.object,
  mapOptions: PropTypes.func.isRequired,
  children: PropTypes.node,
  buildings: PropTypes.object,
};

 GoogleMapContainer = createContainer(
    (props) => {
        if (props.userLocation){
            let subscription = Meteor.subscribe(
            "buildings",
            props.userLocation.lat(),
            props.userLocation.lng(),
            );
        }
        return{
            loaded: GoogleMaps.loaded(),
            buildings: (props.userLocation)?
             Buildings.find({}).fetch() : [],
        };
    },
    GoogleMap,
);

export default GoogleMapContainer;
