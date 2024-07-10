import {
	type Message,
	type ServerMessage,
	clientMessageSchema,
} from "@anon-bun-monorepo/schema";
import { saveMessage, getRecentMessages, closeDatabase } from "./lib/databases";
import { logger } from "./lib/logger";
import { sanitiseMessage } from "./lib/validation";

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // This allows connections from any IP

const server = Bun.serve<{ username: string }>({
	port: PORT,
	hostname: HOST,
	fetch(req, server) {
		const url = new URL(req.url);
		if (url.pathname === "/ws") {
			const success = server.upgrade(req, {
				data: { username: `User${Math.floor(Math.random() * 1000)}` },
			});
			logger.log("successfully upgraded the connection.");
			return success
				? undefined
				: new Response("WebSocket upgrade error", { status: 400 });
		}

		return new Response("Hello world");
	},
	websocket: {
		open(ws) {
			const username = ws.data.username;
			const userEventMessage: ServerMessage = {
				type: "user_event",
				content: `${username} has entered the chat`,
			};
			ws.subscribe("the-group-chat");
			server.publish("the-group-chat", JSON.stringify(userEventMessage));

			const recentMessages = getRecentMessages(50);
			const recentMessagesEvent: ServerMessage = {
				type: "recent_messages",
				messages: recentMessages,
			};
			console.log("Sending recent messages event:", JSON.stringify(recentMessagesEvent));
			ws.send(JSON.stringify(recentMessagesEvent));
		},
		message(ws, message: string) {
			try {
				const rawMessage = JSON.parse(message);
				const sanMessageContent = sanitiseMessage(rawMessage.content);
				const parsedMessage = clientMessageSchema.parse({
					...rawMessage,
					content: sanMessageContent,
				});
				const savedMessageId = saveMessage(
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

				server.publish("the-group-chat", JSON.stringify(serverMessage));
			} catch (err) {
				console.error("Invalid message format", err);
				logger.error("Invalid message format", err);
			}
		},
		close(ws) {
			const userEventMessage: ServerMessage = {
				type: "user_event",
				content: `${ws.data.username} has left the chat.`,
			};
			ws.unsubscribe("the-group-chat");
			server.publish("the-group-chat", JSON.stringify(userEventMessage));
		},
	},
});

console.log(`Listening on ${server.hostname}:${server.port}`);
logger.log(`Listening on ${server.hostname}:${server.port}`);

// Graceful shutdown
process.on("SIGINT", () => {
	closeDatabase();
	process.exit(0);
});
