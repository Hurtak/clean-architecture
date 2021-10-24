import { ValueFromPromise } from "../../utils/typescript";
import { StorageClient, storageClient } from "./storage-client";
import { storageTodos } from "./storage-todos";

export const storage = async () => {
	const storageClientInstance: StorageClient = await storageClient();

	// In real world application there would be some kind of migration architecture in place to take care of this.
	// Here we just populate the DB with initial tables and data. (the DB gets cleared up after each app run because it
	// is only kept in memory).
	await storageClientInstance.mutation(`
		CREATE TABLE todos (
			id INTEGER PRIMARY KEY,
			text TEXT,
			completed BOOLEAN
		);
	`);
	await storageClientInstance.mutation(`
		INSERT INTO todos (text, completed) VALUES
			("todo 1", true),
			("todo 2", false);
	`);

	return {
		todos: storageTodos({ storageClient: storageClientInstance }),
	};
};

export type Storage = ValueFromPromise<ReturnType<typeof storage>>;
