import { LocalTime } from 'js-joda';

/**
 * Takes a written day and returns the index of the day. 0 = Sunday, 6 = Saturday.
 */
export function convertDayToIndex(day) {
    switch (day) {
        case "Sun":
            return 0;
        case "Mon":
            return 1;
        case "Tue":
            return 2;
        case "Wed":
            return 3;
        case "Thu":
            return 4;
        case "Fri":
            return 5;
        case "Sat":
            return 6;
        default:
            throw new Error(`${ day } is not a valid day.`);
    }
}

/**
 * In order to parse a string as a time object, it needs to be in the format of hh:mm. Many times come in the format of
 * h:mm (e.g 9:00) so we need to pad the time (e.g. 09:00).
 */
export function stringToLocalTime(time) {
    const split = time.split(":");
    if (split[0].length == 1) {
        return LocalTime.parse((`0${ time }`))
    } else{
        return LocalTime.parse(time);
    }
}

/**
 * This function trivially parses a mongo object (stored LocalTime) into a new LocalTime instance.
 */
export function mongoToLocalTime(mongoTime) {
    return LocalTime.of(mongoTime["_hour"], mongoTime["_minute"])
}