import express from "express";
import { z } from "zod";

import { Todos } from "../../3-use-cases/todos";

// TODO
/* eslint-disable @typescript-eslint/no-misused-promises */

export const restApi = ({ port, todos }: { port: number; todos: Todos }): void => {
	const server = express();

	server.get("/heartbeat", function (req, res) {
		res.send("OK");
	});

	server.get("/", async (req, res) => {
		const data = await todos.get();
		res.json(data);
	});

	server.get("/:id", async (req, res) => {
		const paramsValidator = z.object({
			id: z
				.string()
				.nonempty()
				.regex(/^\d+$/, "ID must be a whole number")
				.transform((str) => Number(str)),
		});
		const params = paramsValidator.safeParse(req.params);
		if (!params.success) {
			res.status(400).json({ error: params.error });
			return;
		}

		const todo = await todos.getById(params.data.id);
		if (todo) {
			res.json(todo);
		} else {
			res.status(404).json({ message: "Not Found" });
		}
	});

	server.delete("/", async (req, res) => {
		await todos.deleteAll();
		res.sendStatus(204);
	});

	server.listen(port, () => {
		console.log(`Server running at http://localhost:${port}`);
	});
};
