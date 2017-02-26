import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import SearchBar from './search-bar.jsx';
import MyMap from './my-map.jsx';

// App component - represents the whole app
class App extends Component {
    constructor(props){
        import { Meteor } from 'meteor/meteor';
        Meteor.call('getClosestAvailableBuildings', 5, 49.260605, -123.245994, "16:00", 2, function(error, data) {
            console.log(data);
        });
        super(props);
        this.state = {
            userLocation: null
        };
        this.handleMapClick = this.handleMapClick.bind(this);
    }

    handleMapClick(event) {
        this.setState({
            userLocation: event.latLng
        });
    }

    getUserLoc(){
        if (this.state.userLocation){
            return "Lat: ".concat(this.state.userLocation.lat(), " Lng: ",this.state.userLocation.lng());
        }
        else {
            return "Click map to enter location"
        }
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>{this.getUserLoc()}</h1>
                    <SearchBar placeholder = "search for data"/>
                </header>
                <MyMap onMapClick = {this.handleMapClick}/>
            </div>
        );
    }
}

export default createContainer(() => {
    return {

    };
}, App);
