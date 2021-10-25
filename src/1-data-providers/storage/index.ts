import { ValueFromPromise } from "../../utils/typescript";
import { storageClient } from "./storage-client";
import { storageMigrations } from "./storage-migrations";
import { storageTodos } from "./storage-todos";

export const storage = async () => {
	const storageClientInstance = await storageClient();
	await storageMigrations({ storageClient: storageClientInstance });

	return {
		todos: storageTodos({ storageClient: storageClientInstance }),
	};
};

export type Storage = ValueFromPromise<ReturnType<typeof storage>>;
