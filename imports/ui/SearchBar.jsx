import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import ReactDOM from 'react-dom';
import { Times } from '../api/times.js';
import Time from './Time.jsx';
import MyMap from '../MyMap.jsx';


export default class SearchBar extends Component{
render(){
  return(
    <div>
  <form className="search-db" onSubmit={this.handleSubmit.bind(this)} >
    <input
      type="text"
      ref="textInput"
      placeholder={this.props.placeholder}
    />
  </form>
</div>
)
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
