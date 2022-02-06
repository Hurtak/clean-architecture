import { Todo, TodoWithoutId } from "../4-entities/todos";
import { getTodosUseCaseMock } from "../utils/test/mock-todos-use-case";
import { getId, idDoesNotExist } from "../utils/test/test-helpers";
import { todos } from "./todos";

describe("todos", () => {
	const t1: Todo = { id: getId(), text: "t1", completed: false };
	const t2: Todo = { id: getId(), text: "t2", completed: true };
	const initialState: Todo[] = [t1, t2];

	let instance = todos({ todos: getTodosUseCaseMock(initialState) });
	beforeEach(() => {
		instance = todos({ todos: getTodosUseCaseMock(initialState) });
	});

	describe("getAll", () => {
		test("gets all todos", async () => {
			const res = await instance.getAll();
			expect(res).toEqual(initialState);
		});
	});

	describe("getById", () => {
		test("returns todo when id exists", async () => {
			const res = await instance.getById(t1.id);
			expect(res).toEqual(t1);
		});
		test("returns null when does not id exists", async () => {
			const res = await instance.getById(idDoesNotExist);
			expect(res).toEqual(null);
		});
	});

	describe("create", () => {
		const t: TodoWithoutId = { text: "t", completed: false };

		test("creates todo", async () => {
			const res = await instance.create(t);
			expect(res).toEqual({ id: res.id, ...t });
		});
		test("increases number of todos by one", async () => {
			const res1 = await instance.getAll();
			expect(res1).toHaveLength(initialState.length);

			await instance.create(t);

			const res2 = await instance.getAll();
			expect(res2).toHaveLength(initialState.length + 1);
		});
		test("returns null when does not id exists", async () => {
			const res = await instance.getById(idDoesNotExist);
			expect(res).toEqual(null);
		});
	});

	describe("patchById", () => {
		test("patches todo", async () => {
			const patch: Partial<Todo> = { text: "patched" };
			const patchById = await instance.patchById(t1.id, patch);
			expect(patchById).toEqual({ ...t1, ...patch });
		});
	});

	describe("deleteById", () => {
		test("deletes todo if it exists", async () => {
			const todoToDelete = t2;
			const idToDelete = todoToDelete.id;

			const res1 = await instance.getAll();
			expect(res1).toEqual(initialState);

			const res2 = await instance.deleteById(idToDelete);
			expect(res2).toEqual(todoToDelete);

			const res3 = await instance.getAll();
			expect(res3).toEqual(initialState.filter((t) => t.id !== idToDelete));
		});

		test("does not do anything if does not exists", async () => {
			const res1 = await instance.deleteById(idDoesNotExist);
			expect(res1).toEqual(null);

			const res2 = await instance.getAll();
			expect(res2).toEqual(initialState);
		});
	});

	test("deleteAll", async () => {
		const res1 = await instance.getAll();
		expect(res1).toHaveLength(initialState.length);

		await instance.deleteAll();

		const res2 = await instance.getAll();
		expect(res2).toHaveLength(0);
	});
});
