<!--
  This code is a reusable vuejs pincode input.
  You can use it without copyright restrictions.

  USAGE:
    <Pincode
      @finished="handleFinished"
      :secure="false"
      :material="true"
      :length="6"
      :white="false"
    />
  
  NOTE:
  - The inputed pin code is in the `digits` computed ref
  - The finished emit contains the code
  - If you know how to implement the v-model directive, 
    don't hesitate to tell me how to do so

-->

<template>
  <div class="pincode">
    <span class="pincode-inputs">
      <input
        v-for="(inputRef, index) in inputedPincode"
        :key="index"
        maxlength="1"
        v-model="inputedPincode[index]"
        @keypress="avoidNumbers($event)"
        @keyup="handleInput($event, index + 1)"
        @paste.prevent="handlePaste($event)"
        class="pincode-input"
        :class="(materialStyle ? 'material' : '') + (darkMode ? ' white' : '')"
        :type="hidden ? 'password' : 'text'"
      />
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Ref } from 'vue'

/*
`autofocus` (boolean) is the focus or not of the first input on mount,
`length` (number) is the number of digits,
`secure` (boolean) hiddes the input or not,
`material` (boolean) is the styling of the input
`white` (boolean) is the color of the input
*/
const { autofocus, length, secure, material, white } = defineProps([
  'autofocus',
  'length',
  'secure',
  'material',
  'white',
])
const automaticFocus = ref(autofocus ?? true)
const nbOfDigits = ref(length ?? 6)
const hidden = ref(secure ?? true)
const materialStyle = ref(material ?? false)
const darkMode = ref(white ?? false)

// This emit passes the inputed code to the parent
const emit = defineEmits(['finished'])

// Creates a ref containg an array of empty strings
const inputedPincode: Ref<string[]> = ref(
  Array(nbOfDigits.value).map((_) => ''),
)
// The typed code is stored here
const digits: Ref<string> = computed(() => inputedPincode.value.join(''))

onMounted(() => {
  if (automaticFocus) getElementByIndex(0).focus()
})

function handleInput(event: any, index: number) {
  // If the input is neither a number nor a backspace, don't treat the event
  if (!/[0-9]/g.test(event.code) && event.code != 'Backspace') {
    return
  }
  // If the input is a backspace, delete the previous input
  if (event.code == 'Backspace' && index > 0) {
    getElementByIndex(index - 2).focus()
    getElementByIndex(index - 2).value = ''
    inputedPincode.value[index - 2] = ''
    return
  }
  // If there is an input ahed the curent input, focus it
  if (index < nbOfDigits.value) {
    getElementByIndex(index).focus()
  } else {
    // Else, emit the completion event
    emit('finished', digits.value)
  }
}

// Paste handling function
function handlePaste(event: any) {
  // Distribute the pasted characters between the inputs
  const copiedChars: string[] = [...event.clipboardData.getData('text')]
  copiedChars.forEach((char: string, index: number) => {
    // If the character is a number, paste it in the input and regiter it
    if (/[0-9]/g.test(char)) {
      getElementByIndex(index).value = char
      inputedPincode.value[index] = char
    }
  })
  // Focusses the last input after the paste for convenience
  getElementByIndex(copiedChars.length - 1).focus()
  if (copiedChars.length == nbOfDigits.value) {
    emit('finished', digits.value)
  }
}

function avoidNumbers(event: any) {
  // If the input is not a number, then cancel it
  if (!/[0-9]/g.test(event.code) && event.code != 'Backspace') {
    event.preventDefault()
  }
}

function getElementByIndex(index: number): HTMLInputElement {
  if (index >= 0 && index < nbOfDigits.value) {
    return document.querySelectorAll('.pincode-input')[
      index
    ] as HTMLInputElement
  } else {
    return getElementByIndex(0)
  }
}
</script>

<style scoped>
.pincode {
  padding: 20px;
}
.pincode-inputs {
  display: flex;
}
.pincode-inputs input {
  width: 20px;
  font-size: x-large;
  text-align: center;
  height: 20px;
  padding: 10px;
  display: block;
}
.material {
  border-bottom: 2px solid gray;
  border-left: 0;
  border-top: 0;
  border-right: 0;
  outline: 0;
  color: black;
  margin: 0 7px 0 0;
  background: transparent;
  border-radius: 0;
}
.white {
  border-bottom: 2px solid gray;
  color: white;
}
</style>
