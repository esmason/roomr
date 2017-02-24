import '../imports/api/times.js'
import '../imports/database/collections';
import './database_access/retrieve-buildings.js'
import { RoomSlots, Rooms, Buildings } from '../imports/database/collections';
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
    'getClosestNAvailableBuildings': getClosestAvailableBuildings
});