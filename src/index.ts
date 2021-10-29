import { config } from "./0-config";
import { logger } from "./1-data-providers/logger";
import { storage } from "./1-data-providers/storage";
import { api } from "./2-entrypoints/api";
import { todos } from "./3-use-cases/todos";

const main = async (): Promise<void> => {
	const loggerInstance = logger({ prefix: "app" });
	loggerInstance.log("starting");
	loggerInstance.log(`NODE_ENV=${String(process.env.NODE_ENV)}`);

	const configInstance = config();

	const storageInstance = await storage({ logger: logger({ prefix: "db" }) });
	const todosInstance = todos({
		storage: storageInstance,
	});

	api({
		port: configInstance.port,
		todos: todosInstance,
		logger: logger({ prefix: "api" }),
	});
};

void main();
