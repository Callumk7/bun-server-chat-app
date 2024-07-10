<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Message from "@/components/chat/Message.vue";
import NewMessage from "@/components/chat/NewMessage.vue";
import { useMessageStore } from "@/stores/messages";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";

const ws = ref<WebSocket | null>(null);
const messageStore = useMessageStore();

onMounted(() => {
	ws.value = new WebSocket(WS_URL);
	ws.value.onmessage = (event: MessageEvent) => {
		messageStore.append(event.data);
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
  <div class="relative w-11/12 mx-auto h-[95vh]">
    <div class="flex flex-col gap-4">
      <Message v-for="(msg, index) in messageStore.visibleMessages" :key="index" :message="msg" />
    </div>
    <NewMessage @send="addMessage" class="absolute w-full bottom-0" />
  </div>
</template>
