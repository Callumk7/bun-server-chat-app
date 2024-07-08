import { defineStore } from "pinia";
import { uuidv4 } from "callum-util";

export type Message = {
	id: string;
	content: string;
	isFlagged: boolean;
	isHidden: boolean;
};

export const useMessageStore = defineStore("messages", {
	state: () => ({
		messages: [] as Message[],
	}),
	getters: {
		allMessages(state) {
			return state.messages;
		},
		visibleMessages(state) {
			return state.messages.filter((msg) => !msg.isHidden);
		},
	},
	actions: {
		append(messageContent: string) {
			this.messages.push({
				id: uuidv4(),
				content: messageContent,
				isFlagged: false,
				isHidden: false,
			});
		},
		markAsFlagged(id: string) {
			const message = this.messages.find((msg) => msg.id === id);
			if (message) {
				message.isFlagged = true;
			}
		},
		markAsHidden(id: string) {
			const message = this.messages.find((msg) => msg.id === id);
			if (message) {
				message.isHidden = true;
			}
		},
	},
});
