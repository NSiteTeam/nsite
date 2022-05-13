export default interface date {
    // The attributes of the date
    seconds: number
    minutes: number
    hours: number
    day: number
    month: number
    year: number
    digits: Array<number>

    beautify(): string
    isGreaterThan(otherDate: date): boolean
    isLessThan(otherDate: date): boolean
    isGreaterThan(otherDate: date): boolean
}