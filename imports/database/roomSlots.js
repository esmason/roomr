import { LocalTime } from 'js-joda';
import { Mongo } from 'meteor/mongo';
import { DatabaseAccessObject } from './database-access-object';

const RoomSlots = new Mongo.Collection('roomSlots');

RoomSlots.schema = new SimpleSchema({
    building: {type: String}, // corresponds to the _id of a Building document.
    room: {type: String}, // corresponds to the _id of a Room document.
    days: {type: [Number], min: 0, max: 6, maxCount: 7}, // corresponds to the days of the week that room is taken.
    startTime: {type: LocalTime}, // corresponds to the occupation start time
    endTime: {type: LocalTime}, // corresponds to the occupation end time
    occupier: {type: String} //corresponds to which class or activity is occupying the room
});

export const RoomSlotsAccessObject = new DatabaseAccessObject(RoomSlots);