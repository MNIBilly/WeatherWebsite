
<script setup>
import { ref } from 'vue'

const text = ref('')

function onInput(e) {
  text.value = e.target.value
}
</script>

<template>
  <h1>Hello World!</h1>

  <input :value="text" @input="onInput" placeholder="Type here">
  <p>{{ text }}</p>
</template>