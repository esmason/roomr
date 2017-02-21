import NodeGeocoder from 'node-geocoder';
import geocoderOptions from '/server/database_initialization/geocoderSettings'
import {Buildings} from './DatabaseConstruction'

const geocoder = NodeGeocoder(geocoderOptions);

export function geocodeBuildings(buildings) {
    const addresses = buildings.map(function (building) {
        return building['address'] + " Vancouver B.C. Canada";
    });

    let geocodePromise = new Promise(function (resolve, reject) {
        geocoder.batchGeocode(addresses, function (err, res) {
            if (err) {
                reject(err);
            } else {
                const updateObjects = [];
                for (let i = 0; i < res.length; i++) {
                    let currResult = res[i]['value'][0];
                    let updateObject = {
                        newLat: currResult['latitude'],
                        newLon: currResult['longitude'],
                        id: buildings[i]['_id'] // GOOGLE returns the addresses in the same order as given
                    };
                    updateObjects.push(updateObject);
                }
                resolve(updateObjects);
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

function updateBuildingWithLatLon(newLat, newLon, id) {
    Buildings.update(id, {
        $set: {latitude: newLat, longitude: newLon}
    });
}