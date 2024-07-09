import { logger } from "./lib/logger";
import { sanitiseMessage } from "./lib/validation";

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // This allows connections from any IP

let username = 0;

const server = Bun.serve<{ username: string }>({
	port: PORT,
	hostname: HOST,
	fetch(req, server) {
		const url = new URL(req.url);
		if (url.pathname === "/ws") {
			logger.log("upgrade!");
			username += 1;
			const success = server.upgrade(req, { data: { username } });
			logger.log("successfully upgraded the connection.");
			return success
				? undefined
				: new Response("WebSocket upgrade error", { status: 400 });
		}

		return new Response("Hello world");
	},
	websocket: {
		open(ws) {
			const msg = `${ws.data.username} has entered the chat`;
			ws.subscribe("the-group-chat");
			server.publish("the-group-chat", msg);
		},
		message(ws, message) {
			// this is a group chat
			// so the server re-broadcasts incoming message to everyone
			const sanMessage = sanitiseMessage(message);
			server.publish("the-group-chat", `${ws.data.username}: ${sanMessage}`);
			logger.log(sanMessage);
		},
		close(ws) {
			const msg = `${ws.data.username} has left the chat`;
			ws.unsubscribe("the-group-chat");
			server.publish("the-group-chat", msg);
			logger.log("connection closed.");
		},
	},
});

console.log(`Listening on ${server.hostname}:${server.port}`);
logger.log(`Listening on ${server.hostname}:${server.port}`);
