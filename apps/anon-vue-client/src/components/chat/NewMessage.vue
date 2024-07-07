<script lang="ts" setup>
import { ref, defineEmits } from 'vue';

// Define emits
const emit = defineEmits(['send']);

// Reactive variable for the new message input
const newMessage = ref<string>('');

// Function to send new message
const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    emit('send', newMessage.value);
    newMessage.value = '';
  }
};
</script>

<template>
  <div class="input-area">
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" />
    <button @click="sendMessage">Send</button>
  </div>
</template>

<style scoped>
.input-area {
  display: flex;
}

input {
  flex: 1;
  padding: 10px;
}

button {
  padding: 10px;
}
</style>
