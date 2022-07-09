// Core types

export type Todo = {
	id: number;
	text: string;
	completed: boolean;
};

export const createTodo = (id: number, text: string, completed: boolean): Todo | Error =>
	validateTodoProperties({
		id,
		text,
		completed,
	});

// Validation

export const validateTodoProperties = <T extends Todo | Partial<Todo>>(todo: T): T | Error => {
	if (todo.text !== undefined) {
		const min = 2;
		if (todo.text.length < min) {
			return new TodoTextTooShort(`Todo text is too short, minimum text.length is ${min} character`);
		}

		const max = 100;
		if (todo.text.length > max) {
			return new TodoTextTooLong(`Todo text is too long, maximum length is ${max} characters`);
		}
	}

	return todo;
};

export class TodoTextTooShort extends Error {}
export class TodoTextTooLong extends Error {}
