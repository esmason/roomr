import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Times } from '../api/times.js';
import Time from './time.jsx';
import SearchBar from './search-bar.jsx';
import MyMap from './my-map.jsx';

// App component - represents the whole app
class App extends Component {
    constructor(props){
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
