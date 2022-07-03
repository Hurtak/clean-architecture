import KoaRouter from "@koa/router";
import Koa from "koa";
import koaBodyParser from "koa-bodyparser";

import { Todos } from "../../3-use-cases/todos";
import { Logger } from "../logger";
import { apiHeartbeat } from "./api-heartbeat";
import { apiTodos } from "./api-todos";
import { apiResponseApply } from "./api-utis";

const formatLogOutput = (body: unknown): string => JSON.stringify(body)?.slice(0, 100) ?? "";

export const api = ({ port, todos, logger }: { port: number; todos: Todos; logger: Logger }): void => {
	const server = new Koa();
	const router = new KoaRouter();

	const apiTodosInstance = apiTodos({ todos });
	const apiHeartbeatInstance = apiHeartbeat();

	// Middleware's before routes
	server.use(koaBodyParser({ enableTypes: ["json"] }));

	server.use(async (ctx, next) => {
		logger.log(`-> ${ctx.method} ${ctx.url} req ${formatLogOutput(ctx.request.body)}`);
		await next();
		logger.log(`<- ${ctx.method} ${ctx.url} res  ${ctx.status} ${formatLogOutput(ctx.body)}`);
	});

	// Routes
	router.get("/heartbeat", (ctx) => apiResponseApply(ctx, apiHeartbeatInstance.heartbeat()));

	router.get("/todos", (ctx) => apiTodosInstance.getAll().then((res) => apiResponseApply(ctx, res)));
	router.post("/todos", (ctx) => apiTodosInstance.create(ctx.request.body).then((res) => apiResponseApply(ctx, res)));
	router.delete("/todos", (ctx) => apiTodosInstance.deleteAll().then((res) => apiResponseApply(ctx, res)));

	router.get("/todos/:id", (ctx) => apiTodosInstance.getById(ctx.params).then((res) => apiResponseApply(ctx, res)));
	router.patch("/todos/:id", (ctx) =>
		apiTodosInstance.patchById(ctx.params, ctx.request.body).then((res) => apiResponseApply(ctx, res))
	);
	router.delete("/todos/:id", (ctx) =>
		apiTodosInstance.deleteById(ctx.params).then((res) => apiResponseApply(ctx, res))
	);

	// Middleware's after routes
	server.use(router.routes());
	server.use(router.allowedMethods());

	// Start server
	server.listen(port, () => {
		logger.log(`server running at http://localhost:${port}`);
	});
};
