import NodeGeocoder from 'node-geocoder';
import { Buildings } from '/imports/database/collections';
import { Meteor } from 'meteor/meteor';

const geocoder = NodeGeocoder(Meteor.settings.geocoderOptions);

/**
 * Takes an array of building objects corresponding to the buildings in the buildings collection and updates their
 * latitude and longitude properties.
 * @param buildings
 */
export function geocodeBuildings(buildings) {
    const addresses = buildings.map(function (building) {
        return building['address'] + " Vancouver B.C. Canada";
    });

    let geocodePromise = new Promise(function (resolve, reject) {
        geocoder.batchGeocode(addresses, function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(collectLatLons(res, buildings));
            }
        });
    });

    geocodePromise.then(function (updateObjects) {
        updateObjects.forEach(function (updateObject) {
            updateBuildingWithLatLon(updateObject.newLat, updateObject.newLon, updateObject.id)
        });
    }).catch(function (err) {
        throw(err);
    })
}

/**
 * Takes the response from the google API and a list of buildings and calculates the correct latitudes and
 * longitudes for each building.
 * @param geocodeResponse
 * @param buildings
 */
function collectLatLons(geocodeResponse, buildings) {
    const updateObjects = [];
    for (let i = 0; i < geocodeResponse.length; i++) {
        let currResult = geocodeResponse[i]['value'][0];
        let updateObject = {
            newLat: currResult['latitude'],
            newLon: currResult['longitude'],
            id: buildings[i]['_id'] // GOOGLE returns the addresses in the same order as given
        };
        updateObjects.push(updateObject);
    }
    return updateObjects;
}

/**
 * Takes a singular building and the correct latitude and longitude and updates the building.
 * @param newLat
 * @param newLon
 * @param id
 */
function updateBuildingWithLatLon(newLat, newLon, id) {
    Buildings.update(id, {
        $set: {latitude: newLat, longitude: newLon}
    });
}