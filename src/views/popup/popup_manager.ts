import type { Ref } from "vue"
import { ref } from "vue"

export enum PopupType {
  CONFIRM,
  PROMPT,
  CHOOSE
}

export type ConfirmPopup = {
  title: string
  content: string
  okMessage: string
  cancelMessage: string
  okCallback: () => void
}

export type PromptPopup = {
  title: string
  message: string
  default: string
  placeholder: string
  okMessage: string
  cancelMessage: string
  onConfirm: (value: string) => void
  computeError: (value: string) => string
}

export type ChoosePopup = {
  title: string
  message: string
  firstChoice: string
  secondChoice: string
  firstCallback: () => void
  secondCallback: () => void
}

export type Popup = ConfirmPopup | PromptPopup | ChoosePopup

/**
 * A singleton to handle popups
 */
export class PopupManager {
  private static instance: PopupManager

  actualPopup: Ref<Popup | null> = ref(null)
  popupType: PopupType | null = null

  private constructor() {}

  public static getInstance(): PopupManager {
    if (!PopupManager.instance) {
      PopupManager.instance = new PopupManager()
    }
    return PopupManager.instance
  }

  public confirm(popup: ConfirmPopup): void {
    if (this.actualPopup.value) {
      throw new Error("A popup is already open")
    }

    this.popupType = PopupType.CONFIRM
    this.actualPopup.value = popup
  }

  public prompt(popup: PromptPopup): void {
    if (this.actualPopup.value) {
      throw new Error("A popup is already open")
    }

    this.popupType = PopupType.PROMPT
    this.actualPopup.value = popup
  }

  public choose(popup: ChoosePopup): void {
    if (this.actualPopup.value) {
      throw new Error("A popup is already open")
    }

    this.popupType = PopupType.CHOOSE
    this.actualPopup.value = popup
  }

  public hideCurrentPopup(): void {
    this.actualPopup.value = null
  }
}
