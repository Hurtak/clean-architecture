import express, { Request, Response } from "express";
import { z } from "zod";

import { Todos } from "../../3-use-cases/todos";

// TODO
/* eslint-disable @typescript-eslint/no-misused-promises */

const validateTodoIdParam = (req: Request, res: Response): { type: "ERROR" } | { type: "OK"; id: number } => {
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
		return { type: "ERROR" };
	}

	return { type: "OK", id: params.data.id };
};

export const restApi = ({ port, todos }: { port: number; todos: Todos }): void => {
	const server = express();

	server.get("/heartbeat", function (req, res) {
		res.send("OK");
	});

	server.get("/", async (req, res) => {
		const data = await todos.getAll();
		res.json(data);
	});
	server.delete("/", async (req, res) => {
		await todos.deleteAll();
		res.sendStatus(204);
	});

	server.get("/:id", async (req, res) => {
		const params = validateTodoIdParam(req, res);
		if (params.type === "ERROR") return;

		const todo = await todos.getById(params.id);
		if (todo) {
			res.json(todo);
		} else {
			res.sendStatus(404);
		}
	});
	server.delete("/:id", async (req, res) => {
		const params = validateTodoIdParam(req, res);
		if (params.type === "ERROR") return;
		const deleted = await todos.deleteById(params.id);
		if (deleted) {
			res.sendStatus(204);
		} else {
			res.sendStatus(404);
		}
	});

	server.listen(port, () => {
		console.log(`Server running at http://localhost:${port}`);
	});
};
