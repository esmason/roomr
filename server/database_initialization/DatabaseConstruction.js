import { Mongo } from 'meteor/mongo';
import { geocodeBuildings } from './geocoder';
import { Meteor } from 'meteor/meteor';

export const RoomSlots = new Mongo.Collection('roomSlots');
export const Rooms = new Mongo.Collection('rooms');
export const Buildings = new Mongo.Collection('buildings');

RoomSlots.schema = new SimpleSchema({
    building: {type: String}, // corresponds to the _id of a Building document.
    room: {type: String}, // corresponds to the _id of a Room document.
    days: {type: [Number], min: 0, max: 6, maxCount: 7}, // corresponds to the days of the week that room is taken.
    startTime: {type: Number, min: 0, max: 24, decimal: true}, // corresponds to the occupation start time
    endTime: {type: Number, min: 0, max: 24, decimal: true}, // corresponds to the occupation end time
    occupier: {type: String} //corresponds to which class or activity is occupying the room
});

Rooms.schema = new SimpleSchema({
    name: {type: String},
    building: {type: String}, // corresponds to the _id of a Building document.
});

Rooms.helpers = {
    RoomSlots() {
        return RoomSlots.find({room: this._id});
    }
};

Buildings.schema = new SimpleSchema({
    name: {type: String},
    address: {type: String},
    latitude: {type: Number, min: -90, max: 90, decimal: true},
    longitude: {type: Number, min: -180, max: 180, decimal: true}
});

Buildings.helpers = {
    Rooms() {
        return Rooms.find({building: this._id});
    }
};

Meteor.methods({
    /**
     * Populates the Rooms collection with database scraped from ubc.ca. The scraped data is stored in roomSlots.json
     */
    'populateBuildingDatabase': function () {
        RoomSlots.remove({});
        Rooms.remove({});
        Buildings.remove({});
        persistRoomSlotsAsBuildings(JSON.parse(Assets.getText('roomSlots.json')));
    }
});

function persistRoomSlotsAsBuildings(roomSlots) {
    const newBuildings = [];
    roomSlots.forEach(function (roomSlot) {
        let building = Buildings.findOne({name: roomSlot['building']});
        if (typeof building === 'undefined') {
            let newBuilding = {
                name: roomSlot['building'],
                address: roomSlot['address'],
                latitude: 0, //set later on as a batch call to google API
                longitude: 0 //set later on as a batch call to google API
            };
            Buildings.insert(newBuilding);
            building = newBuilding;
            newBuildings.push(building);
        }
        let room = Rooms.findOne({name: roomSlot['roomID'], building: building['_id']});
        if (typeof room === 'undefined') {
            let newRoom = {
                name: roomSlot['roomID'],
                building: building['_id']
            };
            Rooms.insert(newRoom);
            room = newRoom;
        }
        let newRoomSlot = {
            building: building['_id'],
            room: room['_id'],
            days: roomSlot['day'],
            startTime: roomSlot['startTime'],
            endTime: roomSlot['endTime'],
            occupier: roomSlot['sectionId']
        };
        RoomSlots.insert(newRoomSlot);
    });
    geocodeBuildings(newBuildings);
}