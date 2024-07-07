let username = 0;
const server = Bun.serve<{ username: string }>({
	fetch(req, server) {
		const url = new URL(req.url);
		if (url.pathname === "/chat") {
			console.log(`upgrade!`);
			username += 1;
			const success = server.upgrade(req, { data: { username } });
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
			server.publish("the-group-chat", `${ws.data.username}: ${message}`);
			console.log(message);
		},
		close(ws) {
			const msg = `${ws.data.username} has left the chat`;
			ws.unsubscribe("the-group-chat");
			server.publish("the-group-chat", msg);
		},
	},
});

console.log(`Listening on ${server.hostname}:${server.port}`);
