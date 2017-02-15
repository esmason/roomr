import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Times } from '../api/times.js';
import Time from './Time.jsx';
import SearchBar from './SearchBar.jsx';
import MyMap from '../MyMap.js';


// App component - represents the whole app
class App extends Component {

  renderTimes() {
    return this.props.times.map((time) => (
      <Time key={time._id} time={time} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Click map to enter location</h1>
            <SearchBar placeholder = "search for data"/>
        </header>
        <ul>
          {this.renderTimes()}
        </ul>
        <MyMap/>
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
