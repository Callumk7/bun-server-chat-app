<script lang="ts" setup>
import { ref } from "vue";
import Button from "../ui/button/Button.vue";
import Input from "../ui/input/Input.vue";

// Define emits
const emit = defineEmits(["send"]);

// Reactive variable for the new message input
const newMessage = ref<string>("");

// Function to send new message
const sendMessage = () => {
	if (newMessage.value.trim() !== "") {
		emit("send", newMessage.value);
		newMessage.value = "";
	}
};
</script>

<template>
  <div class="flex gap-4">
    <Input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" />
    <Button @click="sendMessage">Send</Button>
  </div>
</template>
