import { Mongo } from 'meteor/mongo';
import { RoomsAccessObject } from './rooms';
import { DatabaseAccessObject } from './database-access-object';

const Buildings = new Mongo.Collection('buildings');

Buildings.schema = new SimpleSchema({
    name: {type: String},
    address: {type: String},
    latitude: {type: Number, min: -90, max: 90, decimal: true},
    longitude: {type: Number, min: -180, max: 180, decimal: true}
});

Buildings.helpers({
    Rooms() {
        return RoomsAccessObject.find({building: this._id}).fetch();
    }
});

export const BuildingsAccessObject = new DatabaseAccessObject(Buildings);