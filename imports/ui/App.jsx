import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import SearchBar from './search-bar.jsx';
import MyMap from './my-map.jsx';

availableBuildings = new Mongo.Collection('available-buildings')


// App component - represents the whole app
class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            userLocation: null,
            buildings : [],
            subscription: null,
        }
        this.handleMapClick = this.handleMapClick.bind(this);
    }

    handleMapClick(event) {
        if (this.state.subscription!=null){
          this.state.subscription.stop();
      }
            console.log(this.state.subscription)
            this.setState({
                userLocation: event.latLng,
                subscription: Meteor.subscribe(
                        "buildings",
                        event.latLng.lat(),
                        event.latLng.lng(),
                        () => this.setState({
                            buildings:(typeof availableBuildings.find({}).fetch()[0] !== "undefined")?
                                availableBuildings.find({}).fetch()[0].buildings : [],
                            }),
                    ),
            });
            console.log(this.state.subscription)

            console.log(this.state.buildings);

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
                <MyMap onMapClick = {this.handleMapClick}
                    userLocation={this.state.userLocation}
                    buildings = {this.state.buildings}
                />
            </div>
        );
    }
}

export default createContainer(() => {
return{};
}, App);
