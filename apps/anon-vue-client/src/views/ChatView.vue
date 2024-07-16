<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Message from "@/components/chat/Message.vue";
import NewMessage from "@/components/chat/NewMessage.vue";
import { useMessageStore } from "@/stores/messages";
import { serverMessageSchema, type ClientMessage } from "@anon-bun-monorepo/schema";
import ScrollArea from "@/components/ui/scroll-area/ScrollArea.vue";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";

const ws = ref<WebSocket | null>(null);
const messageStore = useMessageStore();

onMounted(() => {
	ws.value = new WebSocket(WS_URL);
	ws.value.onmessage = (event: MessageEvent) => {
		try {
			const data = serverMessageSchema.parse(JSON.parse(event.data));
			console.log("Received message:", data);
			switch (data.type) {
				case "recent_messages":
					console.log("Setting recent messages:", data.messages);
					messageStore.set(data.messages);
					break;

				case "new_message":
					messageStore.append(data.message);
					break;

				case "user_event":
					messageStore.appendSystemMessage(data.content);
					break;
			}
		} catch (err) {
			console.error("Invalid message format", err);
		}
	};
});

// Function to add a new message to the messages array
const addMessage = (content: string) => {
	if (ws.value && ws.value.readyState === WebSocket.OPEN) {
		const message: ClientMessage = { content };
		ws.value.send(JSON.stringify(message));
	}
};

onBeforeUnmount(() => {
	if (ws.value) ws.value.close();
	console.log("Connection closed by client");
});
</script>

<template>
  <div class="relative w-11/12 mx-auto h-[95vh]">
    <ScrollArea class="w-full h-[90vh]">
      <div class="flex flex-col gap-4">
        <Message v-for="(msg, index) in messageStore.visibleMessages" :key="index" :message="msg" />
      </div>
    </ScrollArea>
    <NewMessage @send="addMessage" />
  </div>
</template>
