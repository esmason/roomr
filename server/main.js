import { Buildings } from '/imports/database/buildings';
import { Rooms } from '/imports/database/rooms';
import { RoomSlots } from '/imports/database/roomSlots';
import { persistScraperRoomSlots } from './database_initialization/database-construction';
import { getClosestAvailableBuildings } from './database_access/retrieve-buildings.js';

Meteor.methods({
    /**
     * Populates the Rooms collection with database scraped from ubc.ca. The scraped data is stored in room-slots.json
     */
    'populateDatabase': function () {
        RoomSlots.remove({});
        Rooms.remove({});
        Buildings.remove({});
        const roomSlotsJSON = JSON.parse(Assets.getText('room-slots.json'));
        persistScraperRoomSlots(roomSlotsJSON);
    },

    /**
     * Gets the n closest buildings to a given lat/lon at a given time on a given day, where none of the returned
     * buildings have zero unoccupied rooms.
     */
    'getClosestAvailableBuildings': getClosestAvailableBuildings
});

if (Meteor.isServer) {

    Meteor.publish('buildings', function buildingsPublication(lat, lng) {
        let ids = [];
        Meteor.call('getClosestAvailableBuildings', 1, lat, lng, "16:00", 2, function(error, data) {
            data.forEach(function(map){
                ids.push(map._id);
            });
        });
        return Buildings.find({ _id: { $in: ids } });
    });
}
