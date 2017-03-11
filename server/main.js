import { BuildingsAccessObject } from '/server/database/buildings';
import { RoomsAccessObject } from '/server/database/rooms';
import { RoomSlotsAccessObject } from '/server/database/roomSlots';
import { persistScraperRoomSlots } from './database_initialization/database-construction';
import { getClosestAvailableBuildings } from './database_access/retrieve-buildings.js';

Meteor.methods({
    /**
     * Populates the Rooms collection with database scraped from ubc.ca. The scraped data is stored in room-slots.json
     */
    'populateDatabase': function () {
        RoomSlotsAccessObject.remove({});
        RoomsAccessObject.remove({});
        BuildingsAccessObject.remove({});
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
    Meteor.publish(
        'buildings',
        function buildingsPublication(lat, lng) {
            var self = this;
            var buildings = getClosestAvailableBuildings(
                4,
                lat,
                lng,
                '16:00',
                2,
            )
            self.added('available-buildings', "test", {buildings: buildings})
            self.ready()
    },
    );
}
