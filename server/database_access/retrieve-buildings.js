import { BuildingsAccessObject } from '/server/database/buildings';
import { getDistanceFromLatLonInKm } from '../utilities/distance-utils';
import { mongoToLocalTime, stringToLocalTime } from '../utilities/date-time-utils';

/**
 * Gets the numBuildings closest buildings to a given lat/lon at a given time on a given day,
 * where none of the returned buildings have zero unoccupied rooms.
 */
export function getClosestAvailableBuildings(numBuildings, lat, lon, time, day) {
    const availableBuildingsArray = [];

    BuildingsAccessObject.find({}).forEach(function (building) {
        let availableRooms = getAvailableRooms(building,time, day);
        if (availableRooms.length > 0) {
            availableBuildingsArray.push(getFrontEndBuildingObject(building, availableRooms));
        }
    });

    return sortAndSpliceAvailableBuildings(availableBuildingsArray, numBuildings, lat, lon);
}

/**
 * getAvailableRooms(building, time, day) gets a buildings rooms that are
 * not occupied at a given time and day
 */
function getAvailableRooms(building, time, day){
    let availableRooms = [];

    building.Rooms().forEach(function(room) {
        if (!roomHasConflict(room, time, day)) {
            availableRooms.push(room['name']);
        }
    });

    return availableRooms;
}

/**
 * roomHasConflict(room, time, day) returns true if a room has
 * a conflicting scheduled class on the given time and day
 */
function roomHasConflict(room, time ,day){
    let allRoomSlots = room.RoomSlots();

    for (let i = 0; i < allRoomSlots.length; i++) {
        if (doesRoomSlotConflict(allRoomSlots[i], time, day)) {
            return true;
        }
    }

    return false;
}

/**
 * Returns true if the given roomSlot occupies the room during the given time on the given day.
 */
function doesRoomSlotConflict(roomSlot, time, day) {
    const startTime = mongoToLocalTime(roomSlot.startTime).toSecondOfDay();
    const endTime = mongoToLocalTime(roomSlot.endTime).toSecondOfDay() - 600; // classes end 10 minutes before the hour
    time = stringToLocalTime(time).toSecondOfDay();

    return (startTime <= time && time < endTime && roomSlot.days.indexOf(day) != -1);
}

/**
 * Takes a building and its available rooms and creates a new object to send to the front end.
 */
function getFrontEndBuildingObject(building, availableRooms) {
    return {
        '_id': building['_id'],
        'name': building['name'],
        'latitude': building['latitude'],
        'longitude': building['longitude'],
        'availableRooms': availableRooms
    };
}

/**
 * Takes an array of buildings with at least one available room and sorts them by distance to the given lat, lon and
 * then returns n of them where n is the numBuildings requested by the front end.
 */
function sortAndSpliceAvailableBuildings(availableBuildingsArray, numBuildings, lat, lon) {
    return availableBuildingsArray.sort(function(b1, b2) {
        let distTob1 = getDistanceFromLatLonInKm(lat, lon, b1.latitude, b1.longitude);
        let distTob2 = getDistanceFromLatLonInKm(lat, lon, b2.latitude, b2.longitude);

        return distTob1 - distTob2;
    }).splice(0, numBuildings);
}
