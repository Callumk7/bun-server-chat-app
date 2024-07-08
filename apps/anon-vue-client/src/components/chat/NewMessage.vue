<script lang="ts" setup>
import { ref, type HTMLAttributes } from "vue";
import Button from "../ui/button/Button.vue";
import Input from "../ui/input/Input.vue";
import { cn } from "@/lib/utils";

const emit = defineEmits(["send"]);

interface Props {
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

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
  <div :class="cn('flex gap-4', props.class)">
    <Input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message" />
    <Button @click="sendMessage">Send</Button>
  </div>
</template>
