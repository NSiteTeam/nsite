import type Message from "../interface/message";

export default class SupabaseMessage implements Message {
    content: string;

    constructor(content: string) {
        this.content = content
    }
}