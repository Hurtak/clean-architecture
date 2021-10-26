import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";

import { Todos } from "../../3-use-cases/todos";
import { createTodoWithoutId, TodoTextTooLong, TodoTextTooShort } from "../../4-entities/todos";

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

const errorResponse = (error: Error) => ({ error: { name: error.name, message: error.message } });

export const restApi = ({ port, todos }: { port: number; todos: Todos }): void => {
	const server = express();
	server.use(express.json());

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
	server.post("/", async (req, res) => {
		const body = z
			.object({
				text: z.string(),
				completed: z.boolean(),
			})
			.safeParse(req.body);
		if (!body.success) {
			res.status(400).json({ error: body.error });
			return;
		}

		let todoWithoutId;
		try {
			todoWithoutId = createTodoWithoutId(body.data.text, body.data.completed);
		} catch (error) {
			if (error instanceof TodoTextTooShort || error instanceof TodoTextTooLong) {
				res.status(400).json(errorResponse(error));
				return;
			} else {
				throw error;
			}
		}

		const newTodo = await todos.create(todoWithoutId);

		res.json(newTodo);
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
	server.patch("/:id", (req, res) => {
		// TODO
		res.sendStatus(500);
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

	// Generic error handler
	// `next` parameter is required because of some magic Express parameters matching
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	server.use((error: Error, req: Request, res: Response, next: NextFunction) => {
		console.log(error);
		res.status(500);
		res.json(errorResponse(error));
	});

	server.listen(port, () => {
		console.log(`Server running at http://localhost:${port}`);
	});
};
