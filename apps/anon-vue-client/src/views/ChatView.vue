<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Message from "@/components/chat/Message.vue";
import NewMessage from "@/components/chat/NewMessage.vue";

const ws = ref<WebSocket | null>(null);
const messages = ref<string[]>([]);

onMounted(() => {
	ws.value = new WebSocket("ws://localhost:3000/chat");
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
	console.log("Connection closed by client");
});
</script>

<template>
  <div class="w-11/12 mx-auto h-[80vh]">
    <div class="messages">
      <Message v-for="(msg, index) in messages" :key="index" :message="msg" />
    </div>
    <NewMessage @send="addMessage" />
  </div>
</template>

