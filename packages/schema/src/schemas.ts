import { z } from "zod";

// Base message schema
export const messageSchema = z.object({
	id: z.number().optional(), // Optional because new messages won't have an ID yet
	username: z.string(),
	content: z.string(),
	timestamp: z.string(),
});

// Server to client messages
export const serverMessageSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("recent_messages"),
		messages: z.array(messageSchema),
	}),
	z.object({
		type: z.literal("new_message"),
		message: messageSchema,
	}),
	z.object({
		type: z.literal("user_event"),
		content: z.string(),
	}),
]);

// Client to server messages
export const clientMessageSchema = z.object({
	content: z.string(),
});

// Infer TypeScript types from Zod schemas
export type Message = z.infer<typeof messageSchema>;
export type ServerMessage = z.infer<typeof serverMessageSchema>;
export type ClientMessage = z.infer<typeof clientMessageSchema>;
