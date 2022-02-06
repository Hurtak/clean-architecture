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

const testParamIdExists = <T>(func: (params: ApiRequestParams) => Promise<ApiResponse<T>>) => {
	test("error when id does not exist", async () => {
		const res = await func({ id: String(idDoesNotExist) });
		expect(res.status).toEqual(404);
	});
};

const testParamIdValid = <T>(func: (params: ApiRequestParams) => Promise<ApiResponse<T>>) => {
	describe("parameter id validation", () => {
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

const testBodyTodoWithoutIdValid = <T>(func: (body: unknown) => Promise<ApiResponse<T>>) => {
	describe("body todo without id validation", () => {
		test("incorrect shape", async () => {
			const t = { foo: 1 };
			const create = await func(t);
			expect(create.status).toEqual(400);
		});
		test("incorrect type", async () => {
			const t: TodoWithoutId = { text: "t", completed: true };
			const create = await func({ ...t, completed: "foo" });
			expect(create.status).toEqual(400);
		});
		test("extra property", async () => {
			const t: TodoWithoutId = { text: "t", completed: true };
			const create = await func({ ...t, extra: 1 });
			expect(create.status).toEqual(400);
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
		testParamIdValid(instance.getById);
		testParamIdExists(instance.getById);

		test("return todo when id exists", async () => {
			const getById = await instance.getById({ id: String(t1.id) });
			expect(getById.status).toEqual(200);
			if (getById.status !== 200) return never();
			expect(getById.body).toEqual(t1);
		});
	});

	describe("create", () => {
		testParamIdValid(instance.create);
		testBodyTodoWithoutIdValid(instance.create);

		test("todo creation", async () => {
			const t: TodoWithoutId = { text: "t", completed: true };
			const create = await instance.create(t);
			expect(create.status).toEqual(200);
			if (create.status !== 200) return never();
			expect(create.body).toEqual({ id: create.body.id, ...t });
		});
	});

	describe("patchById", () => {
		testParamIdValid((p) => instance.patchById(p, {}));
		testParamIdExists((p) => instance.patchById(p, {}));
		testBodyTodoWithoutIdValid((b) => instance.patchById({ id: String(t1.id) }, b));

		test("patch", async () => {
			const patch: Partial<Todo> = { text: "patched" };
			const patchById = await instance.patchById({ id: String(t1.id) }, patch);
			expect(patchById.status).toEqual(200);
			if (patchById.status !== 200) return never();
			expect(patchById.body).toEqual({ ...t1, ...patch });
		});
	});

	describe("deleteById", () => {
		testParamIdValid(instance.deleteById);
		testParamIdExists(instance.deleteById);

		test("deletes todo when id exists", async () => {
			const getById1 = await instance.getById({ id: String(t1.id) });
			expect(getById1.status).toEqual(200);
			if (getById1.status !== 200) return never();

			const deleteById = await instance.deleteById({ id: String(t1.id) });
			expect(deleteById.status).toEqual(200);
			if (deleteById.status !== 200) return never();

			const getById2 = await instance.getById({ id: String(t1.id) });
			expect(getById2.status).toEqual(404);
		});

		test("deletes only todo with given id", async () => {
			const tDeleted = t2;

			const getAll1 = await instance.getAll();
			if (getAll1.status !== 200) return never();
			expect(getAll1.body).toEqual(todos);

			const deleteById = await instance.deleteById({ id: String(tDeleted.id) });
			if (deleteById.status !== 200) return never();

			const getAll2 = await instance.getAll();
			if (getAll2.status !== 200) return never();
			expect(getAll2.body).toEqual(todos.filter((t) => t.id !== tDeleted.id));
		});
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
