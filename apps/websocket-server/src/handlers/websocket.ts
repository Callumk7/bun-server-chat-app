import type { Server, ServerWebSocket } from "bun";
import type { MessageService } from "../services/message-service";
import type { UserService } from "../services/user-service";
import type { WebSocketData } from "../types";
import {
	type Message,
	type ServerMessage,
	clientMessageSchema,
} from "@anon-bun-monorepo/schema";
import { sanitiseMessage } from "../../lib/validation";

export class WebSocketHandler {
	constructor(
		private server: Server,
		private messageService: MessageService,
		private userService: UserService,
	) {}

	handleOpen(ws: ServerWebSocket<WebSocketData>) {
		const username = ws.data.username;
		const userEventMessage: ServerMessage = {
			type: "user_event",
			content: `${username} has entered the chat`,
		};
		ws.subscribe("the-group-chat");
		this.server.publish("the-group-chat", JSON.stringify(userEventMessage));

		const recentMessages = this.messageService.getRecentMessages(50);
		const recentMessagesEvent: ServerMessage = {
			type: "recent_messages",
			messages: recentMessages,
		};
		ws.send(JSON.stringify(recentMessagesEvent));
	}

	handleMessage(ws: ServerWebSocket<WebSocketData>, message: string) {
		try {
			const rawMessage = JSON.parse(message);
			const sanMessageContent = sanitiseMessage(rawMessage.content);
			const parsedMessage = clientMessageSchema.parse({
				...rawMessage,
				content: sanMessageContent,
			});
			const savedMessageId = this.messageService.saveMessage(
				ws.data.username,
				parsedMessage.content,
			);

			const newMessage: Message = {
				id: Number(savedMessageId),
				username: ws.data.username,
				content: parsedMessage.content,
				timestamp: new Date().toISOString(),
			};

			const serverMessage: ServerMessage = {
				type: "new_message",
				message: newMessage,
			};

			this.server.publish("the-group-chat", JSON.stringify(serverMessage));
		} catch (err) {
			console.error("Invalid message format", err);
		}
	}

	handleClose(ws: ServerWebSocket<WebSocketData>) {
		const userEventMessage: ServerMessage = {
			type: "user_event",
			content: `${ws.data.username} has left the chat.`,
		};
		ws.unsubscribe("the-group-chat");
		this.server.publish("the-group-chat", JSON.stringify(userEventMessage));
	}
}
