<template>
  <Overlay
    :on="displayPopup"
    @close="cancel"
  />
  <template v-if='displayPopup'>
    <div v-if='type == PopupType.CONFIRM' class='absolute top-0 left-0 w-screen h-screen center z-40'>
      <div class='shadow-lg rounded-xl border-gray-100 border-2 bg-white w-96'>
        <div class='px-4 mt-2 border-b-2 border-gray-100'>
          <MediumTitle>{{ popup.title }}</MediumTitle>
        </div>
        <div class='px-4 my-2'>
          {{ popup.content }}
        </div>
        <div class='px-4 py-3 border-t-2 border-gray-100 flex justify-between'>
          <ActionButton danger small @click='ok'>{{ popup.okMessage }}</ActionButton>
          <ActionButton cancel small @click='cancel'>{{ popup.cancelMessage }}</ActionButton>
        </div>
      </div>
    </div>

    <div v-if='type == PopupType.PROMPT' class='absolute top-0 left-0 w-screen h-screen center z-40'>
      <div class='shadow-lg rounded-xl border-gray-100 border-2 bg-white w-96'>
        <div class='px-4 mt-2 border-b-2 border-gray-100'>
          <MediumTitle>{{ popup.title }}</MediumTitle>
        </div>
        <div class='px-4 my-2'>
          <div class='pb-4'>{{ popup.message }}</div>
          <InputField
            v-model='promptValue'
            :placeholder='popup.placeholder'
            compact
            :error='promptError'
            focusonappear
            @enter='ok'
          />
        </div>
        <div class='px-4 py-3 border-t-2 border-gray-100 flex justify-between'>
          <ActionButton
            primary
            small
            @click='ok'
            :disabled='!!((!promptValue || promptValue.length == 0) || (promptError && promptError.length > 0))'
          >
            {{ popup.okMessage }}
          </ActionButton>
          <ActionButton cancel small @click='cancel'>
            {{ popup.cancelMessage }}
          </ActionButton>
        </div>
      </div>
    </div>

    <div v-if='type == PopupType.CHOOSE' class='absolute top-0 left-0 w-screen h-screen center z-40'>
      <div class='shadow-lg rounded-xl border-gray-100 border-2 bg-white w-96'>
        <div class='px-4 mt-2 border-b-2 border-gray-100'>
          <MediumTitle>{{ popup.title }}</MediumTitle>
        </div>
        <div class='px-4 my-2'>
          <div class='pb-4'>{{ popup.message }}</div>
          <div class='flex justify-between'>
            <div class='grid grid-cols-2 space-x-2'>
              <ActionButton primary small @click='firstChoice'>{{ popup.firstChoice }}</ActionButton>
              <ActionButton primary-border small @click='secondChoice'>{{ popup.secondChoice }}</ActionButton>
            </div>
            <ActionButton cancel small @click='cancel'>
              Annuler
            </ActionButton>
          </div>
        </div>
      </div>
    </div>

  </template>
</template>

<script setup lang='ts'>
  import Overlay from '@/components/style/Overlay.vue'
  import MediumTitle from '@/components/style/MediumTitle.vue'
  import InputField from '@/components/style/InputField.vue'
  import ActionButton from '@/components/style/ActionButton.vue'
  import type { PromptPopup, ConfirmPopup, Popup, ChoosePopup } from './popup_manager'
  import { PopupManager, PopupType } from './popup_manager'
  import { computed, nextTick } from '@vue/runtime-core'
  import { ref, watch } from 'vue'

  const popup = ref<Popup | null>()
  const type = ref<PopupType | null>()
  const displayPopup = ref(false)

  const promptValue = ref<string | null>(null)
  const promptError = computed(() => {
    if (type.value == PopupType.PROMPT) {
      return (popup.value as PromptPopup).computeError(promptValue.value!!)
    }
  })

  watch(PopupManager.getInstance().actualPopup, () => {
    popup.value = PopupManager.getInstance().actualPopup.value
    type.value = PopupManager.getInstance().popupType
    if (popup.value && type.value === PopupType.PROMPT) {
      promptValue.value = (popup.value as PromptPopup).default
    }
    displayPopup.value = popup.value != null
  })

  function cancel() {
    PopupManager.getInstance().hideCurrentPopup()
  }

  function ok() {
    switch (type.value) {
      case PopupType.CONFIRM:
        const confirmPopup = popup.value as ConfirmPopup
        PopupManager.getInstance().hideCurrentPopup()
        confirmPopup.okCallback()
        break

      case PopupType.PROMPT:
        if (promptError.value) {
          return
        }

        const promptPopup = popup.value as PromptPopup
        PopupManager.getInstance().hideCurrentPopup()
        promptPopup.onConfirm(promptValue.value!!)
        break

      case null:
        throw new Error('No popup to ok')
      default:
        throw new Error('Unknown popup type')
    }
  }

  function firstChoice() {
    const confirmPopup = popup.value as ChoosePopup
    PopupManager.getInstance().hideCurrentPopup()
    confirmPopup.firstCallback()
  }

  function secondChoice() {
    const confirmPopup = popup.value as ChoosePopup
    PopupManager.getInstance().hideCurrentPopup()
    confirmPopup.secondCallback()
  }

</script>
