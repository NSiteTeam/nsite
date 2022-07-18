<template>
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="{
      width: size,
      height: size,
    }"
  >
    <path
      id="triangle1"
      class="triangle"
      d="M78.5366 35L89 44L50 50L78.5366 35Z"
      fill="#ffffff"
    />
    <path
      id="triangle2"
      class="triangle"
      d="M63.7564 66L50 50L87 56.8571L63.7564 66Z"
      fill="#ffffff"
    />
    <path
      id="triangle3"
      class="triangle"
      d="M57 66.1053L31 67L50.2593 50L57 66.1053Z"
      fill="#ffffff"
    />
    <path
      id="triangle4"
      class="triangle"
      d="M18.2174 73L7 59.2L50 50L18.2174 73Z"
      fill="#ffffff"
    />
    <path
      id="triangle6"
      class="triangle"
      d="M50 50L45.3571 32L24 36.7368L50 50Z"
      fill="#ffffff"
    />
    <path
      id="triangle5"
      class="triangle"
      d="M50 50L16.4545 39L9 54L50 50Z"
      fill="#ffffff"
    />
    <path
      id="wing"
      fill="#ffffff"
      d="M49 9C56.5556 18 53.25 36.4737 51.8333 45C56.5556 39.3158 72.8 26.5263 100 20.8421C77.8056 19.8947 65.5278 27 60.8056 28.4211C58.6019 22.4211 53.5333 9.75789 49 9Z"
    />
  </svg>
</template>

<script setup lang="ts">
  defineProps({
    size: {
      type: String,
      default: '75%'
    }
  })
</script>
