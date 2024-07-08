<script lang="ts" setup>
import MessageOptions from "./MessageOptions.vue";
import { cn } from "@/lib/utils";
import { useMessageStore, type Message } from "@/stores/messages";

const props = defineProps<{
	message: Message;
}>();

// State
const messageStore = useMessageStore();
function handleFlag() {
	messageStore.markAsFlagged(props.message.id);
}
function handleHide() {
	messageStore.markAsHidden(props.message.id);
}
</script>

<template>
  <div :class="cn({ 'border-red-500 border rounded-sm': message.isFlagged }, 'p-2 pl-0 flex gap-2 items-center')">
    <MessageOptions @flag="handleFlag" @hide="handleHide" />
    <span>{{ message.content }}</span>
  </div>
</template>
