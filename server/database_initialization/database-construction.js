import { geocodeBuildings } from './geocoder';
import { convertDayToIndex, stringToLocalTime } from '/server/utilities/date-time-utils';
import { Buildings } from '/imports/database/buildings';
import { Rooms } from '/imports/database/rooms';
import { RoomSlots } from '/imports/database/roomSlots';

/**
 * Transforms room slots into useful database objects by populating the buildings, rooms, and roomslots collections
 * appropriately.
 *
 * roomSlots that are passed into this function are not appropriate for the app's usage. We parse them into
 * buildings, rooms and a stripped down version of the roomSlot.
 *
 * roomSlots are a JSON object containing an array of roomSlots. Example of a singular roomSlot:
 *
 * {
    "day": [
      "Mon",
      "Wed",
      "Fri"
    ],
    "startTime": "12:00",
    "endTime": "13:00",
    "building": "Buchanan",
    "roomID": "B313",
    "sectionID": "ANTH 201A 001",
    "address": "1866 Main Mall"
   }
 */
export function persistScraperRoomSlots(roomSlots) {
    const buildings = [];
    roomSlots.forEach(function (roomSlot) {
        let building = getOrCreateBuilding(roomSlot, buildings); // mutates buildings
        let room = getOrCreateRoom(roomSlot, building);
        createRoomSlot(roomSlot, building, room);
    });
    geocodeBuildings(buildings);
    console.log("Database Initialized!");
}

/**
 * Takes a roomSlot and gets the relevant building from the buildings collection, or adds it if it didn't exist.
 */
function getOrCreateBuilding(roomSlot, buildings) {
    let building = Buildings.findOne({name: roomSlot['building']});
    if (typeof building === 'undefined') {
        let newBuilding = {
            name: roomSlot['building'],
            address: roomSlot['address'],
            latitude: 0, //set later on as a batch call to google API
            longitude: 0 //set later on as a batch call to google API
        };
        Buildings.schema.validate(newBuilding);
        Buildings.insert(newBuilding);
        building = Buildings.findOne({name: roomSlot['building']});
        buildings.push(building);
    }
    return building;
}

/**
 * Takes a roomSlot and gets the relevant room from the rooms collection, or adds it if it didn't exist.
 */
function getOrCreateRoom(roomSlot, building) {
    let room = Rooms.findOne({name: roomSlot['roomID'], building: building['_id']});
    if (typeof room === 'undefined') {
        let newRoom = {
            name: roomSlot['roomID'],
            building: building['_id']
        };
        Rooms.schema.validate(newRoom);
        Rooms.insert(newRoom);
        room = Rooms.findOne({name: roomSlot['roomID'], building: building['_id']});
    }
    return room;
}

/**
 * Takes a roomSlot and parses it into a roomr roomSlot object and stores it into the roomSlot collection.
 */
function createRoomSlot(roomSlot, building, room) {
    let newRoomSlot = {
        building: building['_id'],
        room: room['_id'],
        days: roomSlot['day'].map(convertDayToIndex),
        startTime: stringToLocalTime(roomSlot['startTime']),
        endTime: stringToLocalTime(roomSlot['endTime']),
        occupier: roomSlot['sectionID']
    };
    RoomSlots.schema.validate(newRoomSlot);
    RoomSlots.insert(newRoomSlot);
}