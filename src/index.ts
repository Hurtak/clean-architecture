import express from "express";
import configLoader from "config";
import { z } from "zod";
import { storage } from "./1-data-providers/storage";

const main = async (): Promise<void> => {
	const configValidator = z.object({
		port: z.number(),
	});
	const config = configValidator.parse(configLoader);

	await storage();

	const server = express();
	server.get("/", function (req, res) {
		res.json({ hello: 1 });
	});
	server.listen(3000, () => {
		console.log(`Server running at http://localhost:3000`);
	});
};

main();
