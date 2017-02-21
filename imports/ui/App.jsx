import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Times } from '../api/times.js';
import Time from './Time.jsx';
import SearchBar from './SearchBar.jsx';
import MyMap from './MyMap.jsx';
import { Meteor } from 'meteor/meteor'


// App component - represents the whole app
class App extends Component {
    constructor(props){
        Meteor.call('populateBuildingDatabase', 1, 100, true, ["ANTH"]);
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


    renderTimes() {
        return this.props.times.map((time) => (
            <Time key={time._id} time={time} />
        ));
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
                <ul>
                    {this.renderTimes()}
                </ul>
                <MyMap onMapClick = {this.handleMapClick}/>
            </div>
        );
    }




}


App.propTypes = {
    times: PropTypes.array.isRequired,
};

export default createContainer(() => {
    return {
        times: Times.find({show: true}).fetch(),
    };
}, App);
