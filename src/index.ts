import sqlite3 from "sqlite3";
import { open } from "sqlite";
import express from "express";
import configLoader from "config";
import { z } from "zod";

const main = async (): Promise<void> => {
	const configValidator = z.object({
		port: z.number(),
	});

	const config = configValidator.parse(configLoader);
	console.log(config);

	const db = await open({
		filename: ":memory:",
		driver: sqlite3.cached.Database,
	});
	await db.exec(`CREATE TABLE tbl (col TEXT)`);
	await db.exec(`INSERT INTO tbl VALUES ("test")`);

	const result = await db.get(`SELECT col FROM tbl WHERE col = ?`, "test");
	console.log(result);

	const server = express();

	server.get("/", function (req, res) {
		res.json({ hello: 1 });
	});

	server.listen(3000, () => {
		console.log(`Server running at http://localhost:3000`);
	});
};

main();
