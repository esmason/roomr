import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Times } from '../api/times.js';
import Time from './Time.jsx';
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
            <form className="search-db" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Search for data"
              />
            </form>
        </header>
        <ul>
          {this.renderTimes()}
        </ul>
        <MyMap/>
      </div>
    );
  }


  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text1 = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Times.find(
        {}
      ).fetch().map((time) => (Times.update({_id: time._id}, {$set :{show: false}}) ));

  Times.find(
      {text :{$regex: '.*'.concat(text1, ".*")} }
    ).fetch().map((time) => (Times.update({_id: time._id}, {$set :{show: true}}) ));


    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
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
