import { RouterContext } from "@koa/router";
import { z } from "zod";

import { Todos } from "../../3-use-cases/todos";
import {
	Todo,
	TodoWithoutId,
	TodoWithoutIdPartial,
	todoWithoutIdPartialValidator,
	todoWithoutIdValidator,
} from "../../4-entities/todos";
import { createErrorResponse } from "./rest-api-utis";

const validateTodoIdParam = (ctx: RouterContext): { type: "OK"; data: Todo["id"] } | { type: "ERROR" } => {
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

	return { type: "OK", data: params.data.id };
};

const validateTodoPartialBody = (
	ctx: RouterContext
): { type: "OK"; data: TodoWithoutIdPartial } | { type: "ERROR" } => {
	const todoWithoutIdPartial = todoWithoutIdPartialValidator.safeParse(ctx.request.body);
	if (!todoWithoutIdPartial.success) {
		ctx.status = 400;
		ctx.body = createErrorResponse(todoWithoutIdPartial.error);
		return { type: "ERROR" };
	}

	return { type: "OK", data: todoWithoutIdPartial.data };
};

const validateTodoWithoutIdBody = (ctx: RouterContext): { type: "OK"; data: TodoWithoutId } | { type: "ERROR" } => {
	const todoWithoutIdParsed = todoWithoutIdValidator.safeParse(ctx.request.body);
	if (!todoWithoutIdParsed.success) {
		ctx.status = 400;
		ctx.body = createErrorResponse(todoWithoutIdParsed.error);
		return { type: "ERROR" };
	}

	return { type: "OK", data: todoWithoutIdParsed.data };
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
			const todoWithoutIdParsed = validateTodoWithoutIdBody(ctx);
			if (todoWithoutIdParsed.type === "ERROR") return;

			const newTodo = await todos.create(todoWithoutIdParsed.data);
			ctx.body = newTodo;
		},

		getById: async (ctx: RouterContext) => {
			const idParsed = validateTodoIdParam(ctx);
			if (idParsed.type === "ERROR") return;

			const todo = await todos.getById(idParsed.data);
			if (todo) {
				ctx.body = todo;
			} else {
				ctx.status = 404;
			}
		},
		deleteById: async (ctx: RouterContext) => {
			const idParsed = validateTodoIdParam(ctx);
			if (idParsed.type === "ERROR") return;

			const deleted = await todos.deleteById(idParsed.data);
			ctx.status = deleted ? 204 : 404;
		},
		patchById: async (ctx: RouterContext) => {
			const idParsed = validateTodoIdParam(ctx);
			if (idParsed.type === "ERROR") return;

			const todoWithoutIdPartialParsed = validateTodoPartialBody(ctx);
			if (todoWithoutIdPartialParsed.type === "ERROR") return;

			const updated = await todos.patchById(idParsed.data, todoWithoutIdPartialParsed.data);
			ctx.status = updated ? 204 : 404;
		},
	};
};
