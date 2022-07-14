import { z } from "zod";

import { createTodo, Todo } from "../../4-domain/todos";

export const todoDatabaseValidator = z
	.object({
		id: z.number(),
		text: z.string(),
		completed: z.number(),
	})
	.strict();

export type TodoDatabase = z.infer<typeof todoDatabaseValidator>;

export const todoDatabaseToTodo = (todoDatabase: TodoDatabase): Todo => {
	const todo = createTodo(todoDatabase.id, todoDatabase.text, Boolean(todoDatabase.completed));
	if (todo instanceof Error) {
		throw todo;
	}
	return todo;
};
