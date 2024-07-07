<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Message from '@/components/chat/Message.vue';
import NewMessage from '@/components/chat/NewMessage.vue';

const ws = ref<WebSocket | null>(null);
const messages = ref<string[]>([]);

onMounted(() => {
  ws.value = new WebSocket('ws://localhost:3000/chat');
  ws.value.onmessage = (event: MessageEvent) => {
    messages.value.push(event.data);
  };
});

// Function to add a new message to the messages array
const addMessage = (msg: string) => {
  if (ws.value) {
    ws.value.send(msg);
  }
};

onBeforeUnmount(() => {
  if (ws.value) ws.value.close();
});
</script>

<template>
  <div class="chat-room">
    <div class="messages">
      <Message v-for="(msg, index) in messages" :key="index" :message="msg" />
    </div>
    <NewMessage @send="addMessage" />
  </div>
</template>

<style scoped>
.chat-room {
  max-width: 600px;
  margin: 0 auto;
}

.messages {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
}
</style>
