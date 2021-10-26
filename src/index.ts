import { config } from "./0-config";
import { storage } from "./1-data-providers/storage";
import { restApi } from "./2-entrypoints/rest-api";
import { todos } from "./3-use-cases/todos";

const main = async (): Promise<void> => {
	const configInstance = config();

	const storageInstance = await storage();
	const todosInstance = todos({
		getTodos: storageInstance.todos.get,
		getTodoById: storageInstance.todos.getById,
		deleteAll: storageInstance.todos.delete,
	});

	restApi({
		port: configInstance.port,
		todos: todosInstance,
	});
};

void main();
