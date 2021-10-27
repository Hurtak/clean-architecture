import { CustomError } from "../utils/errors";

export type TodoWithoutId = {
	text: string;
	completed: boolean;
};
export type Todo = TodoWithoutId & {
	id: number;
};

// Used at the edges of the system before the have Todo saved in the database
export const createTodoWithoutId = (text: string, completed: boolean): TodoWithoutId => {
	if (text.length < 1) {
		throw new TodoTextTooShort("Todo text is too short, minimum length is 1 character");
	}
	if (text.length > 100) {
		throw new TodoTextTooLong("Todo text is too long, maximum length is 100 characters");
	}

	return {
		text,
		completed,
	};
};

// Used inside of the system, after we have done validation and saved to the database - so additional validation
// should not be necessary.
export const createTodo = (id: number, text: string, completed: boolean): Todo => {
	return {
		id,
		text,
		completed,
	};
};

export class TodoTextTooShort extends CustomError {}
export class TodoTextTooLong extends CustomError {}
