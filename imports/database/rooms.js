import { Mongo } from 'meteor/mongo';
import { RoomSlotsAccessObject } from './roomSlots';
import { DatabaseAccessObject } from './database-access-object';


const Rooms = new Mongo.Collection('rooms');

Rooms.schema = new SimpleSchema({
    name: {type: String},
    building: {type: String}, // corresponds to the _id of a Building document.
});

Rooms.helpers({
    RoomSlots() {
        return RoomSlotsAccessObject.find({room: this._id}).fetch();
    }
});

export const RoomsAccessObject = new DatabaseAccessObject(Rooms);