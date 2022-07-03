import { Todos } from "../../3-use-cases/todos";
import {
	ApiTodo,
	todoToApiTodo,
	validateApiTodoId,
	validateApiTodoWithoutId,
	validateApiTodoWithoutIdPartial,
} from "./api-todos-ports";
import { ApiRequestBody, ApiRequestParams, ApiResponse } from "./api-utis";

export const apiTodos = ({ todos }: { todos: Todos }) => {
	return {
		getAll: async (): Promise<ApiResponse<ApiTodo[]>> => {
			const allTodos = await todos.getAll();
			const body = allTodos.map((t) => todoToApiTodo(t));
			return { status: 200, body };
		},
		deleteAll: async (): Promise<ApiResponse<void>> => {
			await todos.deleteAll();
			return { status: 204 };
		},

		create: async (body: ApiRequestBody): Promise<ApiResponse<ApiTodo>> => {
			const apiTodo = validateApiTodoWithoutId(body);
			if (apiTodo.type === "INVALID") return apiTodo.body;

			const newTodo = await todos.create(apiTodo.data);
			return { status: 200, body: newTodo };
		},

		getById: async (params: ApiRequestParams): Promise<ApiResponse<ApiTodo>> => {
			const apiId = validateApiTodoId(params);
			if (apiId.type === "INVALID") return apiId.body;

			const todo = await todos.getById(apiId.data);
			return todo ? { status: 200, body: todoToApiTodo(todo) } : { status: 404 };
		},
		deleteById: async (params: ApiRequestParams): Promise<ApiResponse<ApiTodo>> => {
			const apiId = validateApiTodoId(params);
			if (apiId.type === "INVALID") return apiId.body;

			const todo = await todos.deleteById(apiId.data);
			return todo ? { status: 200, body: todoToApiTodo(todo) } : { status: 404 };
		},
		patchById: async (params: ApiRequestParams, body: ApiRequestBody): Promise<ApiResponse<ApiTodo>> => {
			const apiId = validateApiTodoId(params);
			if (apiId.type === "INVALID") return apiId.body;

			const apiTodoWithoutIdPartial = validateApiTodoWithoutIdPartial(body);
			if (apiTodoWithoutIdPartial.type === "INVALID") return apiTodoWithoutIdPartial.body;

			const todo = await todos.patchById(apiId.data, apiTodoWithoutIdPartial.data);
			return todo ? { status: 200, body: todoToApiTodo(todo) } : { status: 404 };
		},
	};
};
