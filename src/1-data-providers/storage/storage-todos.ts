import { z } from "zod";

import { Todo, TodoWithoutId } from "../../4-entities/todos";
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

	const getAll = async (): Promise<Todo[]> => {
		const data = await storageClient.query(
			todoDatabaseValidator,
			`
				SELECT id, text, completed
				FROM todos
			`
		);

		return data.map(todoDatabaseToTodo);
	};
	const getById = async (id: Todo["id"]): Promise<Todo | null> => {
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
	};

	const create = async (todoWithoutId: TodoWithoutId): Promise<Todo> => {
		await storageClient.mutation(
			`
				INSERT INTO todos (text, completed)
				VALUES ($text, $completed)
			`,
			{ $text: todoWithoutId.text, $completed: todoWithoutId.completed }
		);
		const data = await storageClient.queryOneAlwaysResult(
			z.object({ id: z.number() }),
			`SELECT last_insert_rowid() AS id`
		);
		const todo = await getById(data.id);
		if (!todo) {
			throw new Error("Unexpected state, created Todo but could not find it in the DB after creation.");
		}

		return todo;
	};

	const deleteAll = async (): Promise<void> => {
		await storageClient.mutation(`DELETE FROM todos`);
	};
	const deleteById = async (id: Todo["id"]): Promise<boolean> => {
		await storageClient.mutation(
			`
				DELETE FROM todos
				WHERE id = $id
			`,
			{ $id: id }
		);
		const data = await storageClient.queryOne(
			z.object({ rows_deleted: z.number() }),
			`SELECT changes() AS rows_deleted`
		);

		const deleted = data ? data.rows_deleted > 0 : false;
		return deleted;
	};

	return {
		getAll,
		getById,
		create,
		deleteAll,
		deleteById,
	};
};
