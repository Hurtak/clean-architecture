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
		getAll: async (): Promise<Todo[]> => {
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
		deleteAll: async (): Promise<void> => {
			await storageClient.mutation(`DELETE FROM todos`);
		},
		deleteById: async (id: Todo["id"]): Promise<boolean> => {
			await storageClient.mutation(
				`
					DELETE FROM todos
					where id = $id
				`,
				{ $id: id }
			);
			const res = await storageClient.queryOne(
				z.object({ rows_deleted: z.number() }),
				`select changes() as rows_deleted`
			);

			const deleted = res ? res.rows_deleted > 0 : false;
			return deleted;
		},
	};
};
