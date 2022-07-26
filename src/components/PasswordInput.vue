<template>
  <span class="input-box password">
    <input
      :type="displayPassword ? 'text' : 'password'"
      v-model="password"
      placeholder="Mot de passe"
      @input="handleInput($event)"
    />
    <div class="strength-bar">
      <span
        class="strength-bar-level"
        :class="passwordStrength > 0 ? 'active color' + passwordStrength : ''"
      ></span>
      <span
        class="strength-bar-level"
        :class="passwordStrength > 1 ? 'active color' + passwordStrength : ''"
      ></span>
      <span
        class="strength-bar-level"
        :class="passwordStrength > 2 ? 'active color' + passwordStrength : ''"
      ></span>
    </div>
    <span v-if="passwordStrength > 0">Mot de passe </span>
    <span class="strength-message" :class="'text-color' + passwordStrength">
      {{ strengthLevelsNames[passwordStrength] }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'

// Strength checks RegExp
const strongPassword = new RegExp(
  '^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z]).{8,}$',
)
const mediumPassword = new RegExp(
  '((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))|((?=.*[a-z])(?=.*[A-Z])(?=.{10,}))',
)

enum strengthLevels {
  UNKNOWN,
  WEAK,
  MEDIUM,
  STRONG,
}

const props = defineProps([
  'modelValue',
  'passwordStrength'
])

const passwordStrength: Ref<strengthLevels> = ref(strengthLevels.UNKNOWN)
const strengthLevelsNames = ['', 'faible', 'correct', 'fort']
const displayPassword = ref(false)
const emit = defineEmits(['update:modelValue', 'update:passwordStrength'])
const password = ref('')

function togglePassword(): void {
  displayPassword.value = !displayPassword.value
}

function handleInput(event: any): void {
  emit('update:modelValue', event.target.value)
  emit('update:passwordStrength', event.target.value)
  calculateStrength()
}

function calculateStrength(): void {
  // If the password validates the strong password regex, set the password strength to STRONG (=3)
  if (strongPassword.test(password.value)) {
    passwordStrength.value = strengthLevels.STRONG
    // Else if the password validates the strong password regex, set the password strength to STRONG (=2)
  } else if (mediumPassword.test(password.value)) {
    passwordStrength.value = strengthLevels.MEDIUM
    // Else if there is no password, set the password strength to UNKNOWN (=0)
  } else if (password.value.length == 0) {
    passwordStrength.value = strengthLevels.UNKNOWN
  } else {
    // If the password is neither inexistent, medium nor strong, set its strong to WEAK (=1)
    passwordStrength.value = strengthLevels.WEAK
  }
}
</script>

<style scoped lang="scss">
.strength-bar {
  height: 5px;
  width: 150px;
  display: flex;

  &-level {
    height: 5px;
    margin-top: 2px;
    width: calc(35% + 3px);
    border-radius: 5px;
    margin-right: 2px;
    font-size: 14px;
  }

  .color1 {
    background-color: hsl(0, 100%, 55%);
  }

  .color2 {
    background-color: hsl(198, 100%, 55%);
  }

  .color3 {
    background-color: hsl(106, 78%, 45%);
  }
}

.text-color1 {
  color: hsl(0, 100%, 60%);
}

.text-color2 {
  color: hsl(198, 100%, 55%);
}

.text-color3 {
  color: hsl(106, 78%, 45%);
}

.input-box {
  position: relative;
  min-width: 100px;

  .material-icons {
    position: absolute;
    right: 0;
    top: 2px;
    cursor: pointer;
    // Avoids annoying user selection in various browsers
    user-select: none; /* supported by Chrome and Opera */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
  }
}
</style>
