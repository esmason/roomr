import React, { Component, PropTypes } from 'react';

// Task component - represents a single todo item
export default class Time extends Component {
  render() {
    return (
      <li>{this.props.time.text}</li>
    );
  }
}

Time.propTypes = {
  // This component gets the task to display through a React prop.
  // We can use propTypes to indicate it is required
  time: PropTypes.object.isRequired,
};