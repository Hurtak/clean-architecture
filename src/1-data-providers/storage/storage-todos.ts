import { z } from "zod";

import { createTodo, Todo, TodoWithoutId } from "../../4-entities/todos";
import { Logger } from "../logger";
import { StorageClient } from "./storage-client";

const todoDatabaseValidator = z.object({
	id: z.number(),
	text: z.string(),
	completed: z.number(),
});
type TodoDatabase = z.infer<typeof todoDatabaseValidator>;

export const storageTodos = ({ storageClient, logger }: { storageClient: StorageClient; logger: Logger }) => {
	const todoDatabaseToTodo = (todoDatabase: TodoDatabase): Todo =>
		createTodo(todoDatabase.id, todoDatabase.text, Boolean(todoDatabase.completed));

	const getAll = async (): Promise<Todo[]> => {
		logger.verbose("getting all todos");
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
		logger.verbose(`getting todo ${id}`);
		const data = await storageClient.queryOne(
			todoDatabaseValidator,
			`
				SELECT id, text, completed
				FROM todos
				WHERE id = $id
			`,
			{ $id: id }
		);
		logger.verbose(data ? `getting todo ${id} done` : `getting todo ${id} failed, todo not found`);

		return data ? todoDatabaseToTodo(data) : null;
	};

	const create = async (todoWithoutId: TodoWithoutId): Promise<Todo> => {
		logger.verbose(`creating todo`);
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
		logger.verbose(`created todo with id ${data.id}`);

		return todo;
	};

	const patchById = async (id: Todo["id"], partialTodo: Partial<TodoWithoutId>): Promise<boolean> => {
		logger.verbose(`updating todo ${id}`);
		await storageClient.mutation(
			`
				UPDATE todos
				SET text = COALESCE($text, text),
					completed = COALESCE($completed, completed)
				WHERE id = $id
			`,
			{ $id: id, $text: partialTodo.text ?? null, $completed: partialTodo.completed ?? null }
		);

		const data = await storageClient.queryOne(
			z.object({ rowsUpdated: z.number() }),
			`SELECT changes() AS rowsUpdated`
		);
		const updated = data ? data.rowsUpdated > 0 : false;
		logger.verbose(updated ? `updating todo ${id} done` : `updating todo ${id} failed, todo not found`);

		return updated;
	};

	const deleteAll = async (): Promise<void> => {
		logger.verbose(`deleting all todos`);
		await storageClient.mutation(`DELETE FROM todos`);
	};
	const deleteById = async (id: Todo["id"]): Promise<boolean> => {
		logger.verbose(`deleting todo ${id}`);
		await storageClient.mutation(
			`
				DELETE FROM todos
				WHERE id = $id
			`,
			{ $id: id }
		);

		const data = await storageClient.queryOne(
			z.object({ rowsDeleted: z.number() }),
			`SELECT changes() AS rowsDeleted`
		);
		const deleted = data ? data.rowsDeleted > 0 : false;
		logger.verbose(deleted ? `deleting todo ${id} done` : `deleting todo ${id} failed, todo not found`);

		return deleted;
	};

	return {
		getAll,
		getById,
		create,
		patchById,
		deleteAll,
		deleteById,
	};
};
