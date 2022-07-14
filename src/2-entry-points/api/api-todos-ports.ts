import { z } from "zod";

import { createTodoWithoutId, TodoWithoutId } from "../../3-use-cases/todos/todos-types";
import { Todo, validateTodoProperties } from "../../4-domain/todos";
import { ApiRequestBody, ApiRequestParams, ApiRequestValidation, createErrorResponse } from "./api-utis";

export type ApiTodo = {
	id: number;
	text: string;
	completed: boolean;
};

export type ApiTodoWithoutId = Omit<ApiTodo, "id">;

export const todoToApiTodo = (todo: Todo): ApiTodo => ({
	id: todo.id,
	text: todo.text,
	completed: todo.completed,
});

const validatorApiTodoWithoutId = z
	.object({
		text: z.string(),
		completed: z.boolean(),
	})
	.strict();

const apiBodyToTodoWithoutId = (body: ApiRequestBody): TodoWithoutId | Error => {
	const parsed = validatorApiTodoWithoutId.safeParse(body);
	return parsed.success ? createTodoWithoutId(parsed.data.text, parsed.data.completed) : parsed.error;
};
const apiBodyToPartialTodoWithoutId = (body: ApiRequestBody): Partial<TodoWithoutId> | Error => {
	const parsed = validatorApiTodoWithoutId.partial().safeParse(body);
	return parsed.success ? validateTodoProperties(parsed.data) : parsed.error;
};

export const validateApiTodoId = (params: ApiRequestParams): ApiRequestValidation<Todo["id"]> => {
	const paramsValidator = z.object({
		id: z.string().min(1).regex(/^\d+$/, "URL Todo ID must be a whole number").transform(Number),
	});

	const paramsParsed = paramsValidator.safeParse(params);
	if (!paramsParsed.success) {
		return { type: "INVALID", body: { status: 400, body: createErrorResponse(paramsParsed.error) } };
	}

	return { type: "VALID", data: paramsParsed.data.id };
};

export const validateApiTodoWithoutIdPartial = (body: ApiRequestBody): ApiRequestValidation<Partial<TodoWithoutId>> => {
	const todoWithoutIdPartial = apiBodyToPartialTodoWithoutId(body);
	if (todoWithoutIdPartial instanceof Error) {
		return { type: "INVALID", body: { status: 400, body: createErrorResponse(todoWithoutIdPartial) } };
	}

	return { type: "VALID", data: todoWithoutIdPartial };
};

export const validateApiTodoWithoutId = (body: ApiRequestBody): ApiRequestValidation<TodoWithoutId> => {
	const todoWithoutIdParsed = apiBodyToTodoWithoutId(body);
	if (todoWithoutIdParsed instanceof Error) {
		return { type: "INVALID", body: { status: 400, body: createErrorResponse(todoWithoutIdParsed) } };
	}

	return { type: "VALID", data: todoWithoutIdParsed };
};
