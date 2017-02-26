import { Mongo } from 'meteor/mongo';
import { RoomSlots } from './roomSlots';

export const Rooms = new Mongo.Collection('rooms');

Rooms.schema = new SimpleSchema({
    name: {type: String},
    building: {type: String}, // corresponds to the _id of a Building document.
});

Rooms.helpers({
    RoomSlots() {
        return RoomSlots.find({room: this._id}).fetch();
    }
});