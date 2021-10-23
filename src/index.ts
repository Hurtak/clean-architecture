import sqlite3 from "sqlite3";
import { open } from "sqlite";

const main = async (): Promise<void> => {
	const db = await open<sqlite3.Database, sqlite3.Statement>({
		filename: ":memory:",
		driver: sqlite3.cached.Database,
	});
	// cons
	await db.exec(`CREATE TABLE tbl (col TEXT)`);
	await db.exec(`INSERT INTO tbl VALUES ("test")`);

	const result = await db.get(`SELECT col FROM tbl WHERE col = ?`, "test");
	console.log(result);
	console.log(2);
	console.log(3);
};

main();
