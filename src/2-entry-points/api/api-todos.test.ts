import { assert, beforeEach, describe, expect, test } from "vitest";

import { TodoWithoutId } from "../../3-use-cases/todos/todos-types";
import { Todo } from "../../4-domain/todos";
import { getTodosUseCaseMock } from "../../utils/test/mock-todos-use-case";
import { getId, idDoesNotExist } from "../../utils/test/test-helpers";
import { apiTodos } from "./api-todos";
import { ApiRequestParams, ApiResponse } from "./api-utis";

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
	const t1: Todo = { id: getId(), text: "t1", completed: false };
	const t2: Todo = { id: getId(), text: "t2", completed: true };
	const initialState: Todo[] = [t1, t2];

	let instance = apiTodos({ todos: getTodosUseCaseMock(initialState) });
	beforeEach(() => {
		instance = apiTodos({ todos: getTodosUseCaseMock(initialState) });
	});

	test("getAll", async () => {
		const getAll = await instance.getAll();
		expect(getAll.status).toEqual(200);
		assert(getAll.status === 200);
		expect(getAll.body).toEqual([t1, t2]);
	});

	describe("getById", () => {
		testParamIdValid(instance.getById);
		testParamIdExists(instance.getById);

		test("return todo when id exists", async () => {
			const getById = await instance.getById({ id: String(t1.id) });
			expect(getById.status).toEqual(200);
			assert(getById.status === 200);
			expect(getById.body).toEqual(t1);
		});
	});

	describe("create", () => {
		testParamIdValid(instance.create);
		testBodyTodoWithoutIdValid(instance.create);

		test("todo creation", async () => {
			const t: TodoWithoutId = { text: "text", completed: true };
			const create = await instance.create(t);
			expect(create.status).toEqual(200);
			assert(create.status === 200);
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
			assert(patchById.status === 200);
			expect(patchById.body).toEqual({ ...t1, ...patch });
		});
	});

	describe("deleteById", () => {
		testParamIdValid(instance.deleteById);
		testParamIdExists(instance.deleteById);

		test("deletes todo when id exists", async () => {
			const getById1 = await instance.getById({ id: String(t1.id) });
			expect(getById1.status).toEqual(200);
			assert(getById1.status === 200);

			const deleteById = await instance.deleteById({ id: String(t1.id) });
			expect(deleteById.status).toEqual(200);
			assert(deleteById.status === 200);

			const getById2 = await instance.getById({ id: String(t1.id) });
			expect(getById2.status).toEqual(404);
		});

		test("deletes only todo with given id", async () => {
			const tDeleted = t2;

			const getAll1 = await instance.getAll();
			assert(getAll1.status === 200);
			expect(getAll1.body).toEqual(initialState);

			const deleteById = await instance.deleteById({ id: String(tDeleted.id) });
			assert(deleteById.status === 200);

			const getAll2 = await instance.getAll();
			assert(getAll2.status === 200);
			expect(getAll2.body).toEqual(initialState.filter((t) => t.id !== tDeleted.id));
		});
	});

	test("deleteAll", async () => {
		const getAll1 = await instance.getAll();
		assert(getAll1.status === 200);
		expect(getAll1.body).toHaveLength(initialState.length);

		const deleteAll = await instance.deleteAll();
		expect(deleteAll.status).toEqual(204);

		const getAll2 = await instance.getAll();
		assert(getAll2.status === 200);
		expect(getAll2.body).toHaveLength(0);
	});
});
