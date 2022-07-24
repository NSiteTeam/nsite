<template>
  <div class="otp">
    <h1>Entrez le code de vérification reçu par mail</h1>
    <span class="otp-inputs">
      <input
        v-for="(inputRef, index) in inputedOtp"
        :key="index"
        maxlength="1"
        v-model="inputedOtp[index]"
        @keypress="avoidNumbers($event)"
        @keyup="handleInput($event, index + 1)"
        @paste="handlePaste($event)"
        class="otp-input"
        type="text"
      />
    </span>
    {{ digits }}
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Ref } from 'vue'

const nbOfDigits = 6
const inputedOtp: Ref<string[]> = ref(Array(nbOfDigits).map((_) => ''))
const digits: Ref<string> = computed(() => inputedOtp.value.join(''))

onMounted(() => getElementByIndex(0).focus())

function handleInput(event: any, index: number) {
  if (!/[0-9]/g.test(event.code) && event.code != 'Backspace') {
    return
  }
  if (event.code == 'Backspace' && index > 1) {
    getElementByIndex(index - 2).focus()
    getElementByIndex(index - 2).value = ''
    inputedOtp.value[index - 2] = ''
    return
  }
  if (index < nbOfDigits) {
    getElementByIndex(index).focus()
  } else {
    console.log('Code fini')
  }
}

function handlePaste(event: any) {
  event.preventDefault()
  const copiedCars = [...event.clipboardData.getData('text')]
  copiedCars.forEach((char: string, index: number) => {
    if (/[0-9]/g.test(char)) {
      getElementByIndex(index).value = char
    }
  })
}

function avoidNumbers(event: any) {
  if (!/[0-9]/g.test(event.code) && event.code != 'Backspace') {
    event.preventDefault()
  }
}

function getElementByIndex(index: number): HTMLInputElement {
  return document.querySelectorAll('.otp-input')[index] as HTMLInputElement
}
</script>
