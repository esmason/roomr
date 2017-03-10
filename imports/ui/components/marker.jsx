import React, { Component, PropTypes } from 'react';

export default class Marker extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.marker.setMap(this.props.map);
    }

    componentWillUnmount() {
        this.props.marker.setMap(null);
    }

    render() {
        return null;
    }
}
