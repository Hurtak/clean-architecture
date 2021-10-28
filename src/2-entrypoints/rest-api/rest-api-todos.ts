import { RouterContext } from "@koa/router";
import { z } from "zod";

import { Todos } from "../../3-use-cases/todos";
import { createTodoWithoutId, TodoTextTooLong, TodoTextTooShort } from "../../4-entities/todos";
import { createErrorResponse } from "./rest-api-utis";

const validateTodoIdParam = (ctx: RouterContext): { type: "OK"; id: number } | { type: "ERROR" } => {
	const paramsValidator = z.object({
		id: z
			.string()
			.nonempty()
			.regex(/^\d+$/, "ID must be a whole number")
			.transform((str) => Number(str)),
	});

	const params = paramsValidator.safeParse(ctx.params);
	if (!params.success) {
		ctx.status = 400;
		ctx.body = createErrorResponse(params.error);
		return { type: "ERROR" };
	}

	return { type: "OK", id: params.data.id };
};

export const restApiTodos = ({ todos }: { todos: Todos }) => {
	return {
		getAll: async (ctx: RouterContext) => {
			const data = await todos.getAll();
			ctx.body = data;
		},
		deleteAll: async (ctx: RouterContext) => {
			await todos.deleteAll();
			ctx.status = 204;
		},

		create: async (ctx: RouterContext) => {
			const body = z
				.object({
					text: z.string(),
					completed: z.boolean(),
				})
				.safeParse(ctx.request.body);
			if (!body.success) {
				ctx.status = 400;
				ctx.body = createErrorResponse(body.error);
				return;
			}

			let todoWithoutId;
			try {
				todoWithoutId = createTodoWithoutId(body.data.text, body.data.completed);
			} catch (error) {
				if (error instanceof TodoTextTooShort || error instanceof TodoTextTooLong) {
					ctx.status = 400;
					ctx.body = createErrorResponse(error);
					return;
				} else {
					throw error;
				}
			}

			const newTodo = await todos.create(todoWithoutId);
			ctx.body = newTodo;
		},

		getById: async (ctx: RouterContext) => {
			const params = validateTodoIdParam(ctx);
			if (params.type === "ERROR") return;

			const todo = await todos.getById(params.id);
			if (todo) {
				ctx.body = todo;
			} else {
				ctx.status = 404;
			}
		},
		deleteById: async (ctx: RouterContext) => {
			const params = validateTodoIdParam(ctx);
			if (params.type === "ERROR") return;

			const deleted = await todos.deleteById(params.id);
			ctx.status = deleted ? 204 : 404;
		},
		patchById: (ctx: RouterContext) => {
			const params = validateTodoIdParam(ctx);
			if (params.type === "ERROR") return;

			// TODO
			ctx.status = 500;
		},
	};
};
