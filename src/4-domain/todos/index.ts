export type Todo = {
	id: number;
	text: string;
	completed: boolean;
};

export class ErrorTodoTextTooShort extends Error {}
export class ErrorTodoTextTooLong extends Error {}
export type ErrorTodo = ErrorTodoTextTooShort | ErrorTodoTextTooLong;

export const validateTodoProperties = <T extends Todo | Partial<Todo>>(todo: T): T | ErrorTodo => {
	if (todo.text !== undefined) {
		const TODO_TEXT_MIN_LENGTH = 2;
		if (todo.text.length < TODO_TEXT_MIN_LENGTH) {
			return new ErrorTodoTextTooShort(
				`Todo text is too short, minimum text.length is ${TODO_TEXT_MIN_LENGTH} character`
			);
		}

		const TODO_TEXT_MAX_LENGTH = 100;
		if (todo.text.length > TODO_TEXT_MAX_LENGTH) {
			return new ErrorTodoTextTooLong(
				`Todo text is too long, maximum length is ${TODO_TEXT_MAX_LENGTH} characters`
			);
		}
	}

	return todo;
};

export const createTodo = (id: number, text: string, completed: boolean): Todo | ErrorTodo =>
	validateTodoProperties({
		id,
		text,
		completed,
	});
