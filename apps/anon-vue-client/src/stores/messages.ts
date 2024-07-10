import type { Message } from "@anon-bun-monorepo/schema";
import { defineStore } from "pinia";

interface SystemMessage {
	content: string;
	timestamp: string;
	isSystem: true;
}

interface ClientMessage extends Message {
	isHidden?: boolean;
	isFlagged?: boolean;
}

type AnyMessage = ClientMessage | SystemMessage;

export const useMessageStore = defineStore("messages", {
	state: () => ({
		messages: [] as AnyMessage[],
	}),
	getters: {
		allMessages(state) {
			return state.messages;
		},
		visibleMessages(state): AnyMessage[] {
			return state.messages.filter(
				(msg): msg is AnyMessage => !("isHidden" in msg && msg.isHidden),
			);
		},
	},
	actions: {
		append(data: Message) {
			this.messages.push({ ...data, isHidden: false, isFlagged: false });
		},
		appendSystemMessage(content: string) {
			this.messages.push({
				content,
				timestamp: new Date().toISOString(),
				isSystem: true,
			});
		},
		set(messages: Message[]) {
			console.log("Setting messages in store:", messages);
			this.messages = messages.map((msg) => ({
				...msg,
				isHidden: false,
				isFlagged: false,
			}));
		},
		markAsFlagged(id: number) {
			const message = this.messages.find(
				(msg): msg is ClientMessage => "id" in msg && msg.id === id,
			);
			if (message) {
				message.isFlagged = true;
			}
		},
		markAsHidden(id: number) {
			const message = this.messages.find(
				(msg): msg is ClientMessage => "id" in msg && msg.id === id,
			);
			if (message) {
				message.isHidden = true;
			}
		},
	},
});
