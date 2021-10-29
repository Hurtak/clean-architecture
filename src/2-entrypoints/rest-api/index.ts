import KoaRouter from "@koa/router";
import Koa from "koa";
import koaBodyParser from "koa-bodyparser";

import { Logger } from "../../1-data-providers/logger";
import { Todos } from "../../3-use-cases/todos";
import { restApiTodos } from "./rest-api-todos";
import { apiResponseApply } from "./rest-api-utis";

export const restApi = ({ port, todos, logger }: { port: number; todos: Todos; logger: Logger }): void => {
	const server = new Koa();
	const router = new KoaRouter();
	const apiTodos = restApiTodos({ todos });

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

	router.get("/", (ctx) => apiTodos.getAll().then((res) => apiResponseApply(ctx, res)));
	router.post("/", (ctx) => apiTodos.create(ctx.request.body).then((res) => apiResponseApply(ctx, res)));
	router.delete("/", (ctx) => apiTodos.deleteAll().then((res) => apiResponseApply(ctx, res)));

	router.get("/:id", (ctx) => apiTodos.getById(ctx.params).then((res) => apiResponseApply(ctx, res)));
	router.patch("/:id", (ctx) =>
		apiTodos.patchById(ctx.params, ctx.request.body).then((res) => apiResponseApply(ctx, res))
	);
	router.delete("/:id", (ctx) => apiTodos.deleteById(ctx.params).then((res) => apiResponseApply(ctx, res)));

	// Middlewares after routes
	server.use(router.routes());
	server.use(router.allowedMethods());

	// Start server
	server.listen(port, () => {
		logger.log(`server running at http://localhost:${port}`);
	});
};
