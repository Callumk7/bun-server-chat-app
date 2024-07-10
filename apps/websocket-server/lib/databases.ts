// apps/websocket-server/lib/database.ts
import { Database } from "bun:sqlite";

let db: Database;

function initializeDatabase() {
	if (db) return; // Database already initialized

	try {
		db = new Database("messages.sqlite", { create: true });
		db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT,
        content TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
		console.log("Database initialized successfully");
	} catch (error) {
		console.error("Failed to initialize database:", error);
		throw error;
	}
}

export function saveMessage(username: string, content: string): number {
	if (!db) initializeDatabase();

	try {
		const insert = db.prepare(
			"INSERT INTO messages (username, content) VALUES ($username, $content)",
		);
		const result = insert.run({ $username: username, $content: content });
		console.log(`Message saved successfully. Row ID: ${result.lastInsertRowid}`);
		return result.lastInsertRowid as number;
	} catch (error) {
		console.error("Error saving message:", error);
		throw error;
	}
}

export function getRecentMessages(limit = 50) {
	if (!db) initializeDatabase();

	try {
		const query = db.prepare(
			"SELECT * FROM messages ORDER BY timestamp DESC LIMIT $limit",
		);
		const results = query.all({ $limit: limit }) as {
			id: number;
			username: string;
			content: string;
			timestamp: string;
		}[];
		console.log("Retrieved recent messages", results);
		return results;
	} catch (error) {
		console.error("Error getting recent messages:", error);
		throw error;
	}
}

export function closeDatabase() {
	if (db) {
		db.close();
	}
}

// Initialize the database when this module is imported
initializeDatabase();
