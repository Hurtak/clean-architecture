import { StorageClient } from "./storage-client";

export const storageMigrations = async ({ storageClient }: { storageClient: StorageClient }) => {
	// In real world application there would be some kind of migration architecture in place to take care of this.
	// Here we just populate the DB with initial tables and data. (the DB gets cleared up after each app run because it
	// is only kept in memory).
	await storageClient.mutation(`
		CREATE TABLE todos (
			id INTEGER PRIMARY KEY,
			text TEXT,
			completed BOOLEAN
		);
	`);
	await storageClient.mutation(`
		INSERT INTO todos (text, completed) VALUES
			("todo 1", true),
			("todo 2", false);
	`);
};
