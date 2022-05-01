import { Todo, validateTodoProperties } from "../../4-domain/todos";

// Used at the edges of the system
export type TodoWithoutId = Omit<Todo, "id">;

export const createTodoWithoutId = (text: string, completed: boolean): TodoWithoutId | Error =>
	validateTodoProperties({
		text,
		completed,
	});
