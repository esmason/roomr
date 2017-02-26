export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    validateInputs(lat1, lon1, lat2, lon2);

    const R = 6371;
    const dLat = deg2rad(lat2-lat1);
    const dLon = deg2rad(lon2-lon1);
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function validateInputs(lat1, lon1, lat2, lon2) {
    if (Math.abs(lat1) > 90 || Math.abs(lat2) > 90 || !lat1 || !lat2) {
        throw new Error("Invalid latitude");
    }

    if (Math.abs(lon1) > 180 || Math.abs(lon2) > 180 || !lon1 || !lon2) {
        throw new Error("Invalid latitude");
    }
}