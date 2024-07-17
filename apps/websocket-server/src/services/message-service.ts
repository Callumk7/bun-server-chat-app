import type { Message } from "@anon-bun-monorepo/schema";
import Database from "bun:sqlite";

export class MessageService {
	private db: Database;

	constructor(dbPath: string) {
		this.db = new Database(dbPath);
		this.initDatabase();
	}

	private initDatabase() {
		if (this.db) return; // Database already initialized

		try {
			this.db = new Database("messages.sqlite", { create: true });
			this.db.run(`
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

	getRecentMessages(limit = 50): Message[] {
		if (!this.db) this.initDatabase();

		try {
			const query = this.db.prepare(
				"SELECT * FROM messages ORDER BY timestamp ASC LIMIT $limit",
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

	saveMessage(username: string, content: string): number {
		if (!this.db) this.initDatabase();

		try {
			const insert = this.db.prepare(
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

	closeDatabase() {
		if (this.db) {
			this.db.close();
		}
	}
}
