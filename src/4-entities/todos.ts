import { CustomError } from "../utils/errors";

export type TodoWithoutId = {
	text: string;
	completed: boolean;
};
export type Todo = TodoWithoutId & {
	id: number;
};

export const createTodo = (id: number, text: string, completed: boolean): Todo => {
	return {
		id,
		text,
		completed,
	};
};

export class TodoTextTooShort extends CustomError {}
export class TodoTextTooLong extends CustomError {}

export const validateTodo = (todoWithoutId: TodoWithoutId): boolean => {
	if (todoWithoutId.text.length < 1) {
		throw new TodoTextTooShort("Todo text is too short, minimum length is 1 character.");
	}
	if (todoWithoutId.text.length > 100) {
		throw new TodoTextTooLong("Todo text is too long, maximum length is 100 characters.");
	}

	return true;
};
