import { geocodeBuildings } from './geocoder';
import { convertDayToIndex, stringToLocalTime } from '/server/utilities/date-time-utils';
import { BuildingsAccessObject } from '/server/database/buildings';
import { RoomsAccessObject } from '/server/database/rooms';
import { RoomSlotsAccessObject } from '/server/database/roomSlots';

/**
 * Transforms room slots into useful database objects by populating the createdBuildings, rooms, and roomslots collections
 * appropriately.
 *
 * roomSlots that are passed into this function are not appropriate for the app's usage. We parse them into
 * createdBuildings, rooms and a stripped down version of the roomSlot.
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
    const createdBuildings = [];
    roomSlots.forEach(function (roomSlot) {
        let building = getOrCreateBuilding(roomSlot, createdBuildings); // mutates createdBuildings
        let room = getOrCreateRoom(roomSlot, building);
        createRoomSlot(roomSlot, building, room);
    });
    geocodeBuildings(createdBuildings);
    console.log("Database Initialized!");
}

/**
 * Takes a roomSlot and gets the relevant building from the createdBuildings collection, or adds it if it didn't exist.
 */
function getOrCreateBuilding(roomSlot, createdBuildings) {
    let building = BuildingsAccessObject.findOne({name: roomSlot['building']});
    if (typeof building === 'undefined') {
        let newBuilding = {
            name: roomSlot['building'],
            address: roomSlot['address'],
            latitude: 0, //set later on as a batch call to google API
            longitude: 0 //set later on as a batch call to google API
        };
        BuildingsAccessObject.insert(newBuilding);
        building = BuildingsAccessObject.findOne({name: roomSlot['building']});
        createdBuildings.push(building);
    }
    return building;
}

/**
 * Takes a roomSlot and gets the relevant room from the rooms collection, or adds it if it didn't exist.
 */
function getOrCreateRoom(roomSlot, building) {
    let room = RoomsAccessObject.findOne({name: roomSlot['roomID'], building: building['_id']});
    if (typeof room === 'undefined') {
        let newRoom = {
            name: roomSlot['roomID'],
            building: building['_id']
        };
        RoomsAccessObject.insert(newRoom);
        room = RoomsAccessObject.findOne({name: roomSlot['roomID'], building: building['_id']});
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
    RoomSlotsAccessObject.insert(newRoomSlot);
}