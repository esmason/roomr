import '../imports/api/times.js';
import './database_initialization/database-construction.js';
import '../imports/database/collections';
import { RoomSlots, Rooms, Buildings } from '../imports/database/collections';
import { persistRoomSlotsAsBuildings } from './database_initialization/database-construction'

Meteor.methods({
    /**
     * Populates the Rooms collection with database scraped from ubc.ca. The scraped data is stored in roomSlots.json
     */
    'populateDatabase': function () {
        RoomSlots.remove({});
        Rooms.remove({});
        Buildings.remove({});
        const roomSlotsJSON = JSON.parse(Assets.getText('roomSlots.json'));
        persistRoomSlotsAsBuildings(roomSlotsJSON);
    }
});