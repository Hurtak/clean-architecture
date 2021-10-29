import { z } from "zod";

import { Todo, todoValidator } from "../../4-entities/todos";

export const todoDatabaseValidator = z
	.object({
		id: z.number(),
		text: z.string(),
		completed: z.number(),
	})
	.strict();

export type TodoDatabase = z.infer<typeof todoDatabaseValidator>;

export const todoDatabaseToTodo = (todoDatabase: TodoDatabase): Todo =>
	todoValidator.parse({ id: todoDatabase.id, text: todoDatabase.text, completed: Boolean(todoDatabase.completed) });
