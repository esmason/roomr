import NodeGeocoder from 'node-geocoder';
import geocoderOptions from '/server/database_initialization/geocoderSettings'

const geocoder = NodeGeocoder(geocoderOptions);

export function geocodeBuildings(buildings) {
    console.log("geocoding");
    const addresses = buildings.map(function (building) {
        return building['address'] + " Vancouver B.C. Canada";
    });
    console.log("mapped oh fuck yes");
    geocoder.batchGeocode(addresses, function (err, res) {
        if (err) {
            console.log("oh shittttt" +  err);
        } else {
            res.forEach(function (data) {
                console.log(data['value']);
            })
        }
    })
}