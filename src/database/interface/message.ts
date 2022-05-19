import type date from "@/utils/interface/date";

export default interface Message {
    id: number
    content: string;
    author: string;
    date: string;
}