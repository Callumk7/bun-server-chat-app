import { MessageService } from "./src/services/message-service";
import { CONFIG } from "./src/config";
import { UserService } from "./src/services/user-service";
import { WebSocketHandler } from "./src/handlers/websocket";
import type { WebSocketData } from "./src/types";
import type { Server } from "bun";
import { errorHandler } from "./src/middleware/error-handler";

const messageService = new MessageService(CONFIG.DB_PATH);
const userService = new UserService();

const server: Server = Bun.serve<WebSocketData>({
	port: CONFIG.PORT,
	hostname: CONFIG.HOST,
	fetch(request, server) {
		const url = new URL(request.url);
		if (url.pathname === "/ws") {
			const success = server.upgrade(request, {
				data: { username: userService.generateUsername() },
			});
			return success
				? undefined
				: new Response("Websocket upgrade error", { status: 400 });
		}
		return new Response("Hello world");
	},
	websocket: {
		open: (ws) =>
			new WebSocketHandler(server, messageService, userService).handleOpen(ws),
		message: (ws, message: string) =>
			new WebSocketHandler(server, messageService, userService).handleMessage(
				ws,
				message,
			),
		close: (ws) =>
			new WebSocketHandler(server, messageService, userService).handleClose(ws),
	},
});

console.log(`Listening on ${server.hostname}:${server.port}`);

process.on("SIGINT", () => {
	messageService.closeDatabase();
	process.exit(0);
});

process.on("uncaughtException", errorHandler);
process.on("unhandledRejection", errorHandler);
