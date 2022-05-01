import { z } from "zod";

import { Logger } from "../../2-entry-points/logger";
import { TodoWithoutId } from "../../3-use-cases/todos/todos-types";
import { Todo } from "../../4-domain/todos";
import { StorageClient } from "./storage-client";
import { todoDatabaseToTodo, todoDatabaseValidator } from "./storage-todos-ports";

export const storageTodos = ({ storageClient, logger }: { storageClient: StorageClient; logger: Logger }) => {
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
			z.object({ id: z.number() }).strict(),
			`SELECT last_insert_rowid() AS id`
		);
		const todo = await getById(data.id);
		if (!todo) {
			throw new Error("Unexpected state, created Todo but could not find it in the DB after creation.");
		}
		logger.verbose(`created todo with id ${data.id}`);

		return todo;
	};

	const patchById = async (id: Todo["id"], partialTodo: Partial<TodoWithoutId>): Promise<Todo | null> => {
		logger.verbose(`updating todo ${id}`);

		await storageClient.mutation(
			`
				UPDATE todos
				SET text = COALESCE($text, text),
					completed = COALESCE($completed, completed)
				WHERE id = $id;
			`,
			{ $id: id, $text: partialTodo.text ?? null, $completed: partialTodo.completed ?? null }
		);

		const todo = await getById(id);
		if (!todo) {
			logger.verbose(`updating todo ${id} failed, todo not found`);
			return null;
		}

		logger.verbose(`updating todo ${id} done`);
		return todo;
	};

	const deleteAll = async (): Promise<void> => {
		logger.verbose(`deleting all todos`);
		await storageClient.mutation(`DELETE FROM todos`);
	};
	const deleteById = async (id: Todo["id"]): Promise<Todo | null> => {
		logger.verbose(`deleting todo ${id}`);

		const todo = await getById(id);
		if (!todo) {
			logger.verbose(`deleting todo ${id} failed, todo not found`);
			return null;
		}

		await storageClient.mutation(
			`
				DELETE FROM todos
				WHERE id = $id
			`,
			{ $id: id }
		);
		logger.verbose(`deleting todo ${id} done`);

		return todo;
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
