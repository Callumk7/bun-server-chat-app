import { expect, test, mock } from "bun:test";
import { WebSocketHandler } from "../../../src/handlers/websocket";

test("WebSocketHandler - handleOpen", () => {
	const mockServer = { publish: mock(() => {}) };
	const mockMessageService = { getRecentMessages: mock(() => []) };
	const mockUserService = { generateUsername: () => "testUser" };
	const handler = new WebSocketHandler(
		mockServer as any,
		mockMessageService as any,
		mockUserService as any,
	);

	const mockWs = {
		send: mock(() => {}),
		subscribe: mock(() => {}),
		data: { username: "testUser" },
	};
	handler.handleOpen(mockWs as any);

	expect(mockWs.subscribe).toHaveBeenCalledWith("the-group-chat");
	expect(mockServer.publish).toHaveBeenCalled();
	expect(mockWs.send).toHaveBeenCalled();
});
