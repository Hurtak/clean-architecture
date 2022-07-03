import { ApiTodo } from "../../2-entry-points/api/api-todos-ports";
import { Todos } from "../../3-use-cases/todos";
import { getId } from "./test-helpers";

export const getTodosUseCaseMock = (initialState: ApiTodo[]): Todos => {
	let todos: ApiTodo[] = [...initialState];

	const getById = (id: number) => Promise.resolve(todos.find((t) => t.id === id));

	return {
		getAll: () => Promise.resolve(todos),
		getById,
		create: (todoWithoutId) => {
			const t = { id: getId(), ...todoWithoutId };
			todos.push(t);
			return Promise.resolve(t);
		},
		patchById: async (id, partialTodoWithoutId) => {
			const t = await getById(id);
			if (!t) return;
			todos = todos.map((t) => (t.id === id ? { ...t, ...partialTodoWithoutId } : t));
			const tPatched = await getById(id);
			return tPatched;
		},
		deleteAll: () => {
			todos = [];
			return Promise.resolve();
		},
		deleteById: async (id) => {
			const t = await getById(id);
			if (!t) return;
			todos = todos.filter((t) => t.id !== id);
			return t;
		},
	};
};
