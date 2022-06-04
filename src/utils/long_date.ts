// ###########################################################################
// ############ The purpose of this class is manage LongDates easily #############
// ###########################################################################

const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
]

export class LongDate {
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

    static ISOStringToLongDate(rawDate: string): LongDate {
        return new LongDate(
            Number(rawDate.split('T')[1].split(':')[2].split('.')[0]),
            Number(rawDate.split('T')[1].split(':')[1]),
            Number(rawDate.split('T')[1].split(':')[0]),
            Number(rawDate.split('T')[0].split('-')[2]),
            Number(rawDate.split('T')[0].split('-')[1]),
            Number(rawDate.split('T')[0].split('-')[0]),
        )
    }

    static latestDateInArray(dates: LongDate[]): LongDate {
        let latest = dates[0]

        dates.forEach(date => {
            if (latest < date) {
                latest = date
            }
        })

        return latest
    }

    static compare(a: LongDate, b: LongDate): number {
        if (a.isGreaterThan(b)) {
            return 1
        }
        if (a.isLessThan(b)) {
            return -1
        }
        else {
            return 0
        }
        
    }

    private dayOnTwoDigits(): string {
        return this.day < 10 ? "0" + this.day.toString() : this.day.toString()
    }

    private monthOnTwoDigits(): string {
        return this.month < 10 ? "0" + this.month.toString() : this.month.toString()
    }

    beautify(shortened: boolean = true): string {
        if (shortened) {
            return `${this.dayOnTwoDigits()}/${this.monthOnTwoDigits()}/${this.year}`
        } else {
            return `le ${this.day} ${months[this.month - 1]} ${this.year} à ${this.hours}h${this.minutes}`
        }
    }

    // #######################################################################
    // ######################### Comparison methods ##########################
    // #######################################################################

    isGreaterThan(otherDate: LongDate): boolean {
        // Loops through all the digits of the LongDate from right to left
        for (let i = this.digits.length ; i >= 0 ; i--) {
            if (this.digits[i] > otherDate.digits[i]) {
                return true
            } else if (this.digits[i] < otherDate.digits[i]) return false
            // If the two digits are equal then it will continue the loop
        }

        // If all of the digits are the same, return false
        return false
    }

    // Those methods are working the same as the method on the top
    isLessThan(otherDate: LongDate): boolean {
        for (let i = this.digits.length ; i >= 0 ; i--) {
            if (this.digits[i] < otherDate.digits[i]) {
                return true
            } else if (this.digits[i] > otherDate.digits[i]) return false
        }
        return false
    }

    isEqualTo(otherDate: LongDate): boolean{
        for (let i = this.digits.length ; i >= 0 ; i++) {
            // If one of the digits is not equal to another, return false
            if (this.digits[i] != otherDate.digits[i]) {
                return false
            }
        }
        return true
    }
}
