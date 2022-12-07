import moment, { Moment } from "moment";

/**
 * @class DateTimeCalculator
 */
class DateTimeCalculator {

    /**
     * @name getDateTimeInNext
     * @static
     * @param hours 
     * @param minutes 
     * @returns 
     */
    static getDateTimeInNext(hours: number, minutes: number = 0): Date {
        this.checkThatHourAndMinutesAreValid(hours, minutes);
        const calculatedDate: Moment = moment().add(hours, "hours");
        calculatedDate.add(minutes, "minutes");
        
        return calculatedDate.toDate();
    }

    /**
     * @name isLessThanCurrentTime
     * @static
     * @param givenDateTime
     * @returns 
     */
    static isLessThanCurrentTime(givenDateTime: Date): boolean {
        return (givenDateTime.getTime() < Date.now());
    }

    /**
     * @name checkThatHourAndMinutesAreValid
     * @static
     * @param hours
     * @param minutes 
     * @returns 
     */
    private static checkThatHourAndMinutesAreValid(hours: number, minutes: number) {
        if(hours < 0) { throw new Error("Hours cannot be negative"); }
        if(minutes < 0) { throw new Error("Minutes cannot be negative"); }
    }

}

export default DateTimeCalculator;