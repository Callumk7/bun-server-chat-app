import { escapeHTML } from "bun";

export function sanitiseMessage(message: string | Buffer) {
	if (typeof message !== "string") {
		throw new Error("Invalid message format");
	}
	return escapeHTML(message).trim().slice(0, 1000);
}
