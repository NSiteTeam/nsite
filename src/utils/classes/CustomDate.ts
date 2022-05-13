import type date from '../interface/date'

// ###########################################################################
// ############ The purpose of this class is manage dates easely #############
// ###########################################################################

class CustomDate implements date {
    seconds: number
    minutes: number
    hours: number
    day: number
    month: number
    year: number
    digits: Array<number>

    constructor(seconds: number = 0, minutes: number = 0, hours: number = 0,
        day: number = 1, month: number = 1, year: number = 1970) {
        this.seconds = seconds
        this.minutes = minutes
        this.hours = hours
        this.day = day
        this.month = month
        this.year = year
        /* Make sure to sort then in value order
        (ex: minutes before hours, years after months) */
        this.digits = [
            this.seconds,
            this.minutes,
            this.hours,
            this.day,
            this.month,
            this.year
        ]
    }

    static ISOStringToCustomDate(rawDate: string): date {
        return new CustomDate(
            Number(rawDate.split('T')[1].split(':')[2].split('.')[0]),
            Number(rawDate.split('T')[1].split(':')[1]),
            Number(rawDate.split('T')[1].split(':')[0]),
            Number(rawDate.split('T')[0].split('-')[2]),
            Number(rawDate.split('T')[0].split('-')[1]),
            Number(rawDate.split('T')[0].split('-')[0]),
        )
    }

    beautify(shortened: boolean = true): string {
        if (shortened) {
            return `${this.day}/${this.month}/${this.year}`
        } else {
            return `${this.day}/${this.month}/${this.year}, ${this.hours}:${this.minutes}:${this.seconds}`
        }
    }

    // #######################################################################
    // ######################### Comparison methods ##########################
    // #######################################################################

    isGreaterThan(otherDate: date): boolean {
        // Loops through all the digits of the date from right to left
        for (let i = this.digits.length ; i >= 0 ; i++) {
            if (this.digits[i] > otherDate.digits[i]) {
                return true
            } else if (this.digits[i] < otherDate.digits[i]) return false
            // If the two digits are equal then it will continue the loop
        }
        // If all of the digits are the same, return false
        return false
    }

    // Those methods are working the same as the method on the top
    isLessThan(otherDate: date): boolean {
        for (let i = this.digits.length ; i >= 0 ; i++) {
            if (this.digits[i] < otherDate.digits[i]) {
                return true
            } else if (this.digits[i] > otherDate.digits[i]) return false
        }
        return false
    }

    isEqualTo(otherDate: date): boolean{
        for (let i = this.digits.length ; i >= 0 ; i++) {
            // If one of the digits is not equal to another, return false
            if (this.digits[i] != otherDate.digits[i]) {
                return false
            }
        }
        return true
    }
}

export default CustomDate