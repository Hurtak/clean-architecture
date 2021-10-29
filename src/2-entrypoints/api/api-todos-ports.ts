import { z } from "zod";

import { Todo, TodoWithoutId, todoWithoutIdValidator } from "../../4-entities/todos";
import { ApiRequestValidation, createErrorResponse } from "./api-utis";

export type ApiTodo = {
	id: number;
	text: string;
	completed: boolean;
};
export const todoToApiTodo = (todo: Todo): ApiTodo => ({
	id: todo.id,
	text: todo.text,
	completed: todo.completed,
});

export const validateApiTodoId = (params: unknown): ApiRequestValidation<Todo["id"]> => {
	const paramsValidator = z.object({
		id: z
			.string()
			.nonempty()
			.regex(/^\d+$/, "URL Todo ID must be a whole number")
			.transform((str) => Number(str)),
	});

	const paramsParsed = paramsValidator.safeParse(params);
	if (!paramsParsed.success) {
		return { type: "INVALID", body: { status: 400, body: createErrorResponse(paramsParsed.error) } };
	}

	return { type: "VALID", data: paramsParsed.data.id };
};

const todoWithoutIdPartialValidator = todoWithoutIdValidator.partial();
type TodoWithoutIdPartial = z.infer<typeof todoWithoutIdPartialValidator>;
export const validateApiTodoWithoutIdPartial = (body: unknown): ApiRequestValidation<TodoWithoutIdPartial> => {
	const todoWithoutIdPartial = todoWithoutIdPartialValidator.safeParse(body);
	if (!todoWithoutIdPartial.success) {
		return { type: "INVALID", body: { status: 400, body: createErrorResponse(todoWithoutIdPartial.error) } };
	}

	return { type: "VALID", data: todoWithoutIdPartial.data };
};

export const validateApiTodoWithoutId = (body: unknown): ApiRequestValidation<TodoWithoutId> => {
	const todoWithoutIdParsed = todoWithoutIdValidator.safeParse(body);
	if (!todoWithoutIdParsed.success) {
		return { type: "INVALID", body: { status: 400, body: createErrorResponse(todoWithoutIdParsed.error) } };
	}

	return { type: "VALID", data: todoWithoutIdParsed.data };
};
