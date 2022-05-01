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
		if (todo.text.length < 1) {
			return new TodoTextTooShort("Todo text is too short, minimum text.length is 1 character");
		}
		if (todo.text.length > 100) {
			return new TodoTextTooLong("Todo text is too long, maximum length is 100 characters");
		}
	}

	return todo;
};

export class TodoTextTooShort extends Error {}
export class TodoTextTooLong extends Error {}
