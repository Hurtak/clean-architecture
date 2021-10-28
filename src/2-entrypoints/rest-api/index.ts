import KoaRouter from "@koa/router";
import Koa from "koa";
import koaBodyParser from "koa-bodyparser";

import { Logger } from "../../1-data-providers/logger";
import { Todos } from "../../3-use-cases/todos";
import { restApiTodos } from "./rest-api-todos";

export const restApi = ({ port, todos, logger }: { port: number; todos: Todos; logger: Logger }): void => {
	const server = new Koa();
	const router = new KoaRouter();
	const restApiTodosInstance = restApiTodos({ todos });

	// Middlewares before routes
	server.use(koaBodyParser({ enableTypes: ["json"] }));

	const formatLogOutput = (body: unknown): string => JSON.stringify(body)?.slice(0, 100) ?? "";
	server.use(async (ctx, next) => {
		logger.log(`-> ${ctx.method} ${ctx.url} req ${formatLogOutput(ctx.request.body)}`);
		await next();
		logger.log(`<- ${ctx.method} ${ctx.url} res  ${ctx.status} ${formatLogOutput(ctx.body)}`);
	});

	// Routes
	router.get("/heartbeat", (ctx) => {
		ctx.body = "OK";
	});

	router.get("/", restApiTodosInstance.getAll);
	router.post("/", restApiTodosInstance.create);
	router.delete("/", restApiTodosInstance.deleteAll);

	router.get("/:id", restApiTodosInstance.getById);
	router.patch("/:id", restApiTodosInstance.patchById);
	router.delete("/:id", restApiTodosInstance.deleteById);

	// Middlewares after routes
	server.use(router.routes());
	server.use(router.allowedMethods());

	// Start server
	server.listen(port, () => {
		logger.log(`server running at http://localhost:${port}`);
	});
};
