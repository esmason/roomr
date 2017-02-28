import { chai } from 'meteor/practicalmeteor:chai';
import { convertDayToIndex, mongoToLocalTime, stringToLocalTime } from '/server/utilities/date-time-utils';
import { LocalTime } from 'js-joda';

describe('date-time-utils', function () {
    describe('convertDayToIndex', function () {
        it('correctly converts Sunday', function () {
            chai.assert.equal(0, convertDayToIndex("Sun"));
        });

        it('correctly converts Monday', function () {
            chai.assert.equal(1, convertDayToIndex("Mon"));
        });

        it('correctly converts Tuesday', function () {
            chai.assert.equal(2, convertDayToIndex("Tue"));
        });

        it('correctly converts Wednesday', function () {
            chai.assert.equal(3, convertDayToIndex("Wed"));
        });

        it('correctly converts Thursday', function () {
            chai.assert.equal(4, convertDayToIndex("Thu"));
        });

        it('correctly converts Friday', function () {
            chai.assert.equal(5, convertDayToIndex("Fri"));
        });

        it('correctly converts Saturday', function () {
            chai.assert.equal(6, convertDayToIndex("Sat"));
        });

        it('throws an exception for a null input', function () {
            chai.expect(() => convertDayToIndex(null)).to.throw();
        });

        it('throws an exception for a different input', function () {
            chai.expect(() => convertDayToIndex("Corgi")).to.throw();
        });
    });

    describe('stringToLocalTime', function () {
        it('correctly creates a LocalTime object for a 5 character string', function () {
            chai.assert.equal(JSON.stringify(new LocalTime(16, 13, 0, 0)), JSON.stringify(stringToLocalTime("16:13")));
        });

        it('correctly creates a LocalTime object for a 4 character string', function () {
            chai.assert.equal(JSON.stringify(new LocalTime(4, 47, 0, 0)), JSON.stringify(stringToLocalTime("4:47")));
        });

        it('throws an error if passed an invalid time', function () {
            chai.expect(() => stringToLocalTime("24:00")).to.throw();
        });

        it('throws an error when passed null', function () {
            chai.expect(() => stringToLocalTime(null)).to.throw();
        });

    });

    describe('mongoToLocalTime', function () {
        it('correctly creates a LocalTime object for a valid mongo object', function () {
            const mongoObject = {
                "_hour": 17,
                "_minute":  55
            };
            chai.assert.equal(JSON.stringify(new LocalTime(17, 55, 0, 0)), JSON.stringify(mongoToLocalTime(mongoObject)));
        });

        it('throws an error if passed an invalid mongo time object', function () {
            const mongoObject = {
                "_hour": 24,
                "_minute":  55
            };
            chai.expect(() => mongoToLocalTime(mongoObject)).to.throw();
        });

        it('throws an error when passed null', function () {
            chai.expect(() => mongoToLocalTime(null)).to.throw();
        });

    });
});