/**
 * Haversine formula for calculating distances on a sphere. Adapted from Chuck here:
 * http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
 */
export function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    validateInputs(lat1, lon1, lat2, lon2);
    const R = 6371;
    const dLat = degToRad(lat2-lat1);
    const dLon = degToRad(lon2-lon1);
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

/**
 * Converts degrees to radians
 */
function degToRad(deg) {
    return deg * (Math.PI/180)
}

/**
 * Validates to ensure that the given lat/lons are valid.
 */
function validateInputs(lat1, lon1, lat2, lon2) {
    if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90 || !lat1 || !lat2) {
        throw new Error("Invalid latitude");
    }

    if (Math.abs(lon1) > 180 || Math.abs(lon2) > 180 || !lon1 || !lon2) {
        throw new Error("Invalid longitude");
    }
}