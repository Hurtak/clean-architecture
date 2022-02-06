import { Logger } from "../../2-entrypoints/logger";
import { storageClient } from "./storage-client";
import { storageMigrations } from "./storage-migrations";
import { storageTodos } from "./storage-todos";

export const storage = async ({ logger }: { logger: Logger }) => {
	const storageClientInstance = await storageClient();
	await storageMigrations({ storageClient: storageClientInstance });

	return {
		todos: storageTodos({ storageClient: storageClientInstance, logger }),
	};
};
