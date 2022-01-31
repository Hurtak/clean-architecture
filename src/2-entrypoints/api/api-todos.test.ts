import { Todos } from "../../3-use-cases/todos";
import { getId } from "../../utils/jest";
import { never } from "../../utils/typescript";
import { apiTodos } from "./api-todos";
import { ApiTodo } from "./api-todos-ports";

const getTodosMock = (initialState: ApiTodo[]): Todos => {
	let todos: ApiTodo[] = initialState ?? [];

	return {
		getAll: () => Promise.resolve(todos),
		getById: (id) => Promise.resolve(todos.find((t) => t.id === id) ?? null),
		create: (todoWithoutId) => {
			const t = { id: getId(), ...todoWithoutId };
			todos.push(t);
			return Promise.resolve(t);
		},
		patchById: (id, partialTodoWithoutId) => {
			const t = todos.find((t) => t.id === id);
			if (!t) {
				return Promise.resolve(null);
			}

			todos = todos.map((t) => (t.id === id ? { ...t, ...partialTodoWithoutId } : t));
			return Promise.resolve(t);
		},
		deleteAll: () => {
			todos = [];
			return Promise.resolve();
		},
		deleteById: (id) => {
			const t = todos.find((t) => t.id === id);
			if (!t) {
				return Promise.resolve(null);
			}
			todos = todos.filter((t) => t.id !== id);
			return Promise.resolve(t);
		},
	};
};

describe("apiTodos", () => {
	const t1 = { id: getId(), text: "t1", completed: false };
	const t2 = { id: getId(), text: "t2", completed: false };
	const todos = [t1, t2];
	const instance = apiTodos({ todos: getTodosMock(todos) });

	test("getAll", async () => {
		const getAll = await instance.getAll();
		expect(getAll.status).toEqual(200);
		if (getAll.status !== 200) return never();
		expect(getAll.body).toEqual([t1, t2]);
	});

	test("deleteAll", async () => {
		const getAll1 = await instance.getAll();
		if (getAll1.status !== 200) return never();
		expect(getAll1.body.length).toEqual(todos.length);

		const deleteAll = await instance.deleteAll();
		expect(deleteAll.status).toEqual(204);

		const getAll2 = await instance.getAll();
		if (getAll2.status !== 200) return never();
		expect(getAll2.body.length).toEqual(0);
	});
});
