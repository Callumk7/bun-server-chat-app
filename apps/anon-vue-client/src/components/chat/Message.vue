<script lang="ts" setup>
import MessageOptions from "./MessageOptions.vue";
import { cn } from "@/lib/utils";
import { useMessageStore, type AnyMessage } from "@/stores/messages";
import { computed } from "vue";

const props = defineProps<{
	message: AnyMessage;
}>();

// State
const messageStore = useMessageStore();
function handleFlag() {
	if ("id" in props.message) {
		messageStore.markAsFlagged(props.message.id);
	}
}

function handleHide() {
	if ("id" in props.message) {
		messageStore.markAsHidden(props.message.id);
	}
}
// Computed property to safely check isFlagged
const isFlagged = computed(() =>
	"isFlagged" in props.message ? props.message.isFlagged : false,
);
</script>

<template>
  <div :class="cn({ 'border-red-500 border rounded-sm': isFlagged }, 'p-2 pl-0 flex gap-2 items-center')">
    <MessageOptions @flag="handleFlag" @hide="handleHide" />
    <span>{{ message.content }}</span>
  </div>
</template>
