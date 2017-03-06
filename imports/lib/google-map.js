import React, { PropTypes } from 'react';
import { Random } from 'meteor/random';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor'


class GoogleMap extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        GoogleMaps.load(this.props.options || {key: Meteor.settings.public.google.api_key});
        this.timer = setInterval( () => this.createMap(), 100);
    }

    componentDidUpdate() {
        this.handleMarkerRerender()
    }


    handleMarkerRerender(){
        if (GoogleMaps.maps.hasOwnProperty(this.name)){
            this.clearMarkers(GoogleMaps.maps[this.name].instance.markers);
            GoogleMaps.maps[this.name].instance.markers = [];

            for (let i = 0; i < this.props.buildings.length; i++) {
                let marker = this.makeBuildingMarker(this.props.buildings[i]);
                marker.setMap(GoogleMaps.maps[this.name].instance);
                GoogleMaps.maps[this.name].instance.markers.push(marker);
           }
        }
    }

  //takes an array of markers and removes them from their associated maps
    clearMarkers(markers){
        for (let i = 0; i < markers.length; i++){
          markers[i].setMap(null);
        }
        for (let i = markers.length - 1; i > -1; i--){
          delete markers[i]
        }
    }

  //takes a new building object and returns a google maps marker at that buildings
  //position that is not yet assigned to a google map
    makeBuildingMarker(building){
        let latLng = {lat: building.latitude, lng: building.longitude};
        let marker = new google.maps.Marker({
            position: latLng,
        });

        return marker
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
