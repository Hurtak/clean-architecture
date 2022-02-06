import { Todos } from "../../3-use-cases/todos";
import { Todo, TodoWithoutId } from "../../4-entities/todos";
import { getId, idDoesNotExist } from "../../utils/jest";
import { never } from "../../utils/typescript";
import { apiTodos } from "./api-todos";
import { ApiTodo } from "./api-todos-ports";
import { ApiRequestParams, ApiResponse } from "./api-utis";

const getTodosMock = (initialState: ApiTodo[]): Todos => {
	let todos: ApiTodo[] = initialState ?? [];

	const getById = (id: number) => Promise.resolve(todos.find((t) => t.id === id) ?? null);

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
			if (!t) return null;
			todos = todos.map((t) => (t.id === id ? { ...t, ...partialTodoWithoutId } : t));
			const tPatched = await getById(id);
			return tPatched ?? null;
		},
		deleteAll: () => {
			todos = [];
			return Promise.resolve();
		},
		deleteById: async (id) => {
			const t = await getById(id);
			if (!t) null;
			todos = todos.filter((t) => t.id !== id);
			return t;
		},
	};
};

const testIdExists = <T>(func: (p: ApiRequestParams) => Promise<ApiResponse<T>>) => {
	test("error when id does not exist", async () => {
		const res = await func({ id: String(idDoesNotExist) });
		expect(res.status).toEqual(404);
	});
};

const testIdParamValid = <T>(func: (p: ApiRequestParams) => Promise<ApiResponse<T>>) => {
	describe("id errors", () => {
		test("error when id is missing", async () => {
			const res = await func({});
			expect(res.status).toEqual(400);
		});
		test("error when id is not a number", async () => {
			const res = await func({ id: "NaN" });
			expect(res.status).toEqual(400);
		});
	});
};

describe("apiTodos", () => {
	const t1 = { id: getId(), text: "t1", completed: false };
	const t2 = { id: getId(), text: "t2", completed: true };
	const todos = [t1, t2];

	let instance = apiTodos({ todos: getTodosMock(todos) });
	beforeEach(() => {
		instance = apiTodos({ todos: getTodosMock(todos) });
	});

	test("getAll", async () => {
		const getAll = await instance.getAll();
		expect(getAll.status).toEqual(200);
		if (getAll.status !== 200) return never();
		expect(getAll.body).toEqual([t1, t2]);
	});

	describe("getById", () => {
		test("return todo when id exists", async () => {
			const getById = await instance.getById({ id: String(t1.id) });
			expect(getById.status).toEqual(200);
			if (getById.status !== 200) return never();
			expect(getById.body).toEqual(t1);
		});

		testIdExists(instance.getById);
		testIdParamValid(instance.getById);
	});

	describe("create", () => {
		test("todo creation", async () => {
			const t: TodoWithoutId = { text: "t", completed: true };
			const create = await instance.create(t);
			expect(create.status).toEqual(200);
			if (create.status !== 200) return never();
			expect(create.body).toEqual({ id: create.body.id, ...t });
		});

		testIdParamValid(instance.create);

		test("incorrect shape", async () => {
			const t = { foo: 1 };
			const create = await instance.create(t);
			expect(create.status).toEqual(400);
		});
		test("incorrect shape", async () => {
			const t: TodoWithoutId = { text: "t", completed: true };
			const create = await instance.create({ ...t, extra: 1 });
			expect(create.status).toEqual(400);
		});
	});

	describe("patchById", () => {
		test("patch", async () => {
			const patch: Partial<Todo> = { text: "patched" };
			const patchById = await instance.patchById({ id: String(t1.id) }, patch);
			expect(patchById.status).toEqual(200);
			if (patchById.status !== 200) return never();
			expect(patchById.body).toEqual({ ...t1, ...patch });
		});

		testIdExists((p) => instance.patchById(p, {}));
		testIdParamValid((p) => instance.patchById(p, {}));
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
