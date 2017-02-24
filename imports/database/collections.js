import { Mongo } from 'meteor/mongo';
import { LocalTime } from 'js-joda';

/**
 * COLLECTIONS
 */
export const Buildings = new Mongo.Collection('buildings');
export const Rooms = new Mongo.Collection('rooms');
export const RoomSlots = new Mongo.Collection('roomSlots');

/**
 * SCHEMAS
 */
Buildings.schema = new SimpleSchema({
    name: {type: String},
    address: {type: String},
    latitude: {type: Number, min: -90, max: 90, decimal: true},
    longitude: {type: Number, min: -180, max: 180, decimal: true}
});

Rooms.schema = new SimpleSchema({
    name: {type: String},
    building: {type: String}, // corresponds to the _id of a Building document.
});

RoomSlots.schema = new SimpleSchema({
    building: {type: String}, // corresponds to the _id of a Building document.
    room: {type: String}, // corresponds to the _id of a Room document.
    days: {type: [Number], min: 0, max: 6, maxCount: 7}, // corresponds to the days of the week that room is taken.
    startTime: {type: LocalTime}, // corresponds to the occupation start time
    endTime: {type: LocalTime}, // corresponds to the occupation end time
    occupier: {type: String} //corresponds to which class or activity is occupying the room
});

/**
 * HELPERS
 */
Buildings.helpers({
    Rooms() {
        return Rooms.find({building: this._id}).fetch();
    }
});

Rooms.helpers({
    RoomSlots() {
        return RoomSlots.find({room: this._id}).fetch();
    }
});
