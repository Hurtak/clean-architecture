import sqlite3 from "sqlite3";
import { open } from "sqlite";

export const storage = async () => {
	const db = await open({
		filename: ":memory:",
		driver: sqlite3.cached.Database,
	});

	// Run initial migration. In real world application there would be some kind
	// of migration architecture in place to take care of this.
	await db.exec(`
		CREATE TABLE todos (
			id INTEGER PRIMARY KEY,
			text TEXT,
			finished BOOLEAN
		);
	`);

	return {};
};
