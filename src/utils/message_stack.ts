import { ref } from "vue"
import type { Ref } from "vue"

export enum MessageType {
  INFO = 'Information',
  SUCCESS = 'Succès',
  WARNING = 'Attention',
  ERROR = 'Erreur',
}

export type Message = {
  type: MessageType
  text: string
  timeout?: number
}

/**
 * A singleton that store messages and pop them after a delay.
 */
export class MessageStack {
  private static readonly DEFAULT_DELAY = 5000
  private static instance: MessageStack

  private messages: Ref<Message[]> = ref([])

  private constructor() {
    // Private constructor, singleton
  }

  public static getInstance(): MessageStack {
    if (!MessageStack.instance) {
      MessageStack.instance = new MessageStack()
    }
    return MessageStack.instance
  }

  public push(message: Message): void {
    this.messages.value.push(message)

    setTimeout(() => {
      this.closeMessage(message)
    }, message.timeout ?? MessageStack.DEFAULT_DELAY)
  }

  // TODO: Make this list readonly
  public getMessages(): Ref<Message[]> {
    return this.messages
  }

  public closeMessage(message: Message): void {
    const index = this.messages.value.indexOf(message)
    if (index !== -1) {
      this.messages.value.splice(index, 1)
    }
  }

  public closeMessageAt(index: number): void {
    this.messages.value.splice(index, 1)
  }
}
