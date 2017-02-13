import React, { Component } from 'react';

import { Times } from '../api/times.js';
import Time from './Time.jsx';


// App component - represents the whole app
export default class App extends Component {
  getTimes() {
    return [
      { _id: 1, text: 'This is time 1' },
      { _id: 2, text: 'This is time 2' },
      { _id: 3, text: 'This is time 3' },
    ];
  }

  renderTimes() {
    return this.getTimes().map((time) => (
      <Time key={time._id} time={time} />
    ));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>
        </header>

        <ul>
          {this.renderTimes()}
        </ul>
      </div>
    );
  }
}
