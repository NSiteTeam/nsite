import type { LongDate } from '@/utils/long_date'
import type { UserMessage } from '../interface/user_message'

export class SupabaseUserMessage implements UserMessage {
    date: LongDate
    message: string
    email: string
    name: string
    HasBeenRead: boolean

    constructor (
        date: LongDate,
        message: string,
        email: string,
        name: string,
        HasBeenRead: boolean,
    ) {
        this.date = date
        this.message = message
        this.email = email
        this.name = name
        this.HasBeenRead = HasBeenRead
    }
}

