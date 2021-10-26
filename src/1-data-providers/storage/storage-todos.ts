import { z } from "zod";

import { Todo } from "../../4-entities/todos";
import { StorageClient } from "./storage-client";

const todoDatabaseValidator = z.object({
	id: z.number(),
	text: z.string(),
	completed: z.number(),
});
type TodoDatabase = z.infer<typeof todoDatabaseValidator>;

export const storageTodos = ({ storageClient }: { storageClient: StorageClient }) => {
	const todoDatabaseToTodo = (todoDatabase: TodoDatabase): Todo => {
		return {
			id: todoDatabase.id,
			text: todoDatabase.text,
			completed: Boolean(todoDatabase.completed),
		};
	};

	return {
		get: async (): Promise<Todo[]> => {
			const data = await storageClient.query(
				todoDatabaseValidator,
				`
					SELECT id, text, completed
					FROM todos
				`
			);

			return data.map(todoDatabaseToTodo);
		},
		getById: async (id: Todo["id"]): Promise<Todo | null> => {
			const data = await storageClient.queryOne(
				todoDatabaseValidator,
				`
					SELECT id, text, completed
					FROM todos
					WHERE id = $id
				`,
				{ $id: id }
			);

			return data ? todoDatabaseToTodo(data) : null;
		},
		delete: async (): Promise<void> => {
			await storageClient.mutation(`DELETE FROM todos`);
		},
	};
};
