import { expect, test, mock } from "bun:test";
import { MessageService } from "../../../src/services/message-service";

test("MessageService - saveMessage", () => {
	const messageService = new MessageService(":memory:");
	const saveId = messageService.saveMessage("testUser", "Hello, World!");

	expect(saveId).toBeGreaterThan(0);
});
