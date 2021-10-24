import express from "express";

import { Todos } from "../../3-use-cases/todos";

export const restApi = ({ port, todos }: { port: number; todos: Todos }): void => {
	const server = express();

	server.get("/heartbeat", function (req, res) {
		res.send("OK");
	});

	// TODO
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	server.get("/todos", async (req, res) => {
		const data = await todos.get();
		res.json(data);
	});

	server.listen(port, () => {
		console.log(`Server running at http://localhost:${port}`);
	});
};
