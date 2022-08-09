import type { LongDate } from "@/utils/long_date";

export interface UserMessage {
    date: LongDate
    message: string
    email: string
    name: string
    HasBeenRead: boolean
}