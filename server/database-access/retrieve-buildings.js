import { Buildings } from '/imports/database/collections';
import { getDistanceFromLatLonInKm } from '../utilities/distance-utils';
import { mongoToLocalTime, stringToLocalTime } from '../utilities/date-time-utils';

/**
 * Gets the numBuildings closest buildings to a given lat/lon at a given time on a given day,
 * where none of the returned buildings have zero unoccupied rooms.
 * @param numBuildings
 * @param lat
 * @param lon
 * @param time
 * @param day
 * @returns {Array.<T>}
 */
export function getClosestAvailableBuildings(numBuildings, lat, lon, time, day) {
    const availableBuildingsArray = [];
    Buildings.find({}).forEach(function (building) {
        let availableRooms = [];
        building.Rooms().forEach(function(room) {
            let clashingRoomSlot = false;
            let allRoomSlots = room.RoomSlots();
            for (let i = 0; i < allRoomSlots.length; i++) {
                if (doesRoomSlotClash(allRoomSlots[i], time, day)) {
                    clashingRoomSlot = true;
                    break;
                }
            }
            if (!clashingRoomSlot) {
                availableRooms.push(room['name']);
            }
        });
        if (availableRooms.length > 0) {
            availableBuildingsArray.push(getReturnBuildingObject(building, availableRooms));
        }
    });

    return sortAndSpliceAvailableBuildings(availableBuildingsArray, numBuildings, lat, lon);
}

/**
 * Returns true if the given roomSlot occupies the room during the given time on the given day.
 * @param roomSlot
 * @param time
 * @param day
 * @returns {boolean}
 */
function doesRoomSlotClash(roomSlot, time, day) {
    const startTime = mongoToLocalTime(roomSlot.startTime).toSecondOfDay();
    const endTime = mongoToLocalTime(roomSlot.endTime).toSecondOfDay() - 600; // classes end 10 minutes before the hour
    time = stringToLocalTime(time).toSecondOfDay();
    return (startTime <= time && time < endTime && roomSlot.days.indexOf(day) != -1);
}

/**
 * Takes a building and its available rooms and creates a new object to send to the front end.
 * @param building
 * @param availableRooms
 * @returns {{_id: *, name: *, latitude: *, longitude: *, availableRooms: *}}
 */
function getReturnBuildingObject(building, availableRooms) {
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
 * @param availableBuildingsArray
 * @param numBuildings
 * @param lat
 * @param lon
 * @returns {Array.<T>}
 */
function sortAndSpliceAvailableBuildings(availableBuildingsArray, numBuildings, lat, lon) {
    return availableBuildingsArray.sort(function(b1, b2) {
        let distTob1 = getDistanceFromLatLonInKm(lat, lon, b1.latitude, b1.longitude);
        let distTob2 = getDistanceFromLatLonInKm(lat, lon, b2.latitude, b2.longitude);
        return distTob1 - distTob2;
    }).splice(0, numBuildings);
}