import { describe, expect, test } from "vitest";

import { createTodo, ErrorTodoTextTooLong, ErrorTodoTextTooShort, Todo, validateTodoProperties } from ".";

describe("todos", () => {
	const t: Todo = { id: 1, text: "text", completed: false };

	describe("createTodo", () => {
		test("creates todo", () => {
			expect(createTodo(t.id, t.text, t.completed)).toEqual(t);
		});
		test("returns error on too short text", () => {
			expect(createTodo(t.id, "", t.completed)).toBeInstanceOf(ErrorTodoTextTooShort);
		});
		test("returns error on too long text", () => {
			expect(createTodo(t.id, "x".repeat(1000), t.completed)).toBeInstanceOf(ErrorTodoTextTooLong);
		});
	});

	describe("validateTodoProperties", () => {
		test("returns the same object when valid", () => {
			expect(validateTodoProperties(t)).toEqual(t);
			expect(validateTodoProperties({ text: "text" })).toEqual({ text: "text" });
			expect(validateTodoProperties({})).toEqual({});
		});
		test("returns error on too short text", () => {
			expect(validateTodoProperties({ text: "" })).toBeInstanceOf(ErrorTodoTextTooShort);
		});
		test("returns error on too long text", () => {
			expect(validateTodoProperties({ text: "x".repeat(1000) })).toBeInstanceOf(ErrorTodoTextTooLong);
		});
	});
});
