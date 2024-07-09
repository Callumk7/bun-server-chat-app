import express from "express";
import http from "node:http";
import WebSocket from "ws";
import path from "node:path";

const app = express();
const server = http.createServer(app);

// Serve static files from the Vue build output
app.use(express.static(path.join(__dirname, "static")));

// API routes (if needed)
app.get("/api/some-data", (req, res) => {
	res.json({ message: "Hello from the API!" });
});

// Catch-all route to serve your Vue app
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "static/index.html"));
});

// WebSocket server
const wss = new WebSocket.Server({ server, path: "/chatroom" });

wss.on("connection", (ws) => {
	console.log("Client connected");

	ws.on("message", (message) => {
		console.log("Received:", message);
		// Broadcast message to all clients
		wss.clients.forEach((client) => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {
				client.send(message);
			}
		});
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
