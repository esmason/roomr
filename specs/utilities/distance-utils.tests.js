import { chai } from 'meteor/practicalmeteor:chai';
import { getDistanceFromLatLonInKm } from '/server/utilities/distance-utils';

describe('distance-utils', function () {
    describe('getDistanceFromLatLonInKM', function () {
        it('throws an error when given an invalid latitude', function () {
            const lat = 500;
            const lon = -115.997854;
            chai.expect(() => getDistanceFromLatLonInKm(lat, lon, lat, lon)).to.throw();
        });

        it('throws an error when given an invalid longitude', function () {
            const lat = 45;
            const lon = -500;
            chai.expect(() => getDistanceFromLatLonInKm(lat, lon, lat, lon)).to.throw();
        });

        it('throws an error when given null values', function () {
            const lat = null;
            const lon = null;
            chai.expect(() => getDistanceFromLatLonInKm(lat, lon, lat, lon)).to.throw();
        });

        it('calculates that the distance from some point to itself is zero', function () {
            const lat = 44.153511;
            const lon = -115.997854;
            chai.assert.equal(0, getDistanceFromLatLonInKm(lat, lon, lat, lon));
        });

        it('correctly resolves that two similar locations are closer together than two distant locations', function () {
            const lat1 = 44.153511;
            const lon1 = -115.997854;
            const lat2 = 44;
            const lon2 = -115;
            const lat3 = 40;
            const lon3 = -120;
            const dist12 = getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
            const dist13 = getDistanceFromLatLonInKm(lat1, lon1, lat3, lon3);
            chai.assert.isAbove(dist13, dist12);
        });
    });
});