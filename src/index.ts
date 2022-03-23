import { config } from "./0-config";
import { storage } from "./1-data-providers/storage";
import { api } from "./2-entrypoints/api";
import { logger } from "./2-entrypoints/logger";
import { todos } from "./3-use-cases/todos";

const main = async (): Promise<void> => {
	const loggerInstance = logger({ prefix: "app" });
	loggerInstance.log("starting");
	loggerInstance.log(`NODE_ENV=${String(process.env.NODE_ENV)}`);

	const configInstance = config();
	loggerInstance.log(`config=${JSON.stringify(configInstance)}`);

	const storageInstance = await storage({ logger: logger({ prefix: "db" }) });
	const todosInstance = todos({
		todos: {
			getAll: storageInstance.todos.getAll,
			getById: storageInstance.todos.getById,
			create: storageInstance.todos.create,
			patchById: storageInstance.todos.patchById,
			deleteAll: storageInstance.todos.deleteAll,
			deleteById: storageInstance.todos.deleteById,
		},
	});

	api({
		port: configInstance.port,
		todos: todosInstance,
		logger: logger({ prefix: "api" }),
	});
};

void main();
