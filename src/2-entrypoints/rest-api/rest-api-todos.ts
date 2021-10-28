import { RouterContext } from "@koa/router";
import { z } from "zod";

import { Todos } from "../../3-use-cases/todos";
import {
	createTodoWithoutId,
	Todo,
	TodoTextTooLong,
	TodoTextTooShort,
	TodoWithoutId,
	todoWithoutIdValidator,
	validateTodo,
} from "../../4-entities/todos";
import { createErrorResponse } from "./rest-api-utis";

const validateTodoIdParam = (ctx: RouterContext): { type: "OK"; id: Todo["id"] } | { type: "ERROR" } => {
	const paramsValidator = z.object({
		id: z
			.string()
			.nonempty()
			.regex(/^\d+$/, "URL Todo ID must be a whole number")
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

const validateTodoPartialBody = (
	ctx: RouterContext
): { type: "OK"; partialTodo: Partial<TodoWithoutId> } | { type: "ERROR" } => {
	const body = todoWithoutIdValidator.partial().strict().safeParse(ctx.request.body);
	if (!body.success) {
		ctx.status = 400;
		ctx.body = createErrorResponse(body.error);
		return { type: "ERROR" };
	}

	const partialTodo = body.data;
	try {
		validateTodo(partialTodo);
	} catch (error) {
		// TODO: somehow share this logic with create todo?
		if (error instanceof TodoTextTooShort || error instanceof TodoTextTooLong) {
			ctx.status = 400;
			ctx.body = createErrorResponse(error);
			return { type: "ERROR" };
		} else {
			throw error;
		}
	}

	return { type: "OK", partialTodo };
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
		patchById: async (ctx: RouterContext) => {
			const params = validateTodoIdParam(ctx);
			if (params.type === "ERROR") return;

			const body = validateTodoPartialBody(ctx);
			if (body.type === "ERROR") return;

			const updated = await todos.patchById(params.id, body.partialTodo);
			ctx.status = updated ? 204 : 404;
		},
	};
};
