import KoaRouter from "@koa/router";
import Koa from "koa";
import koaBodyParser from "koa-bodyparser";
import { z, ZodError } from "zod";

import { Logger } from "../../1-data-providers/logger";
import { Todos } from "../../3-use-cases/todos";
import { createTodoWithoutId, TodoTextTooLong, TodoTextTooShort } from "../../4-entities/todos";

const createErrorResponse = (error: Error | ZodError) => {
	if (error instanceof ZodError) {
		return { error: { name: "ValidationError", message: "Invalid shape the request data", issues: error.issues } };
	}

	return { error: { name: error.name, message: error.message } };
};

const validateTodoIdParam = (ctx: KoaRouter.RouterContext): { type: "ERROR" } | { type: "OK"; id: number } => {
	const paramsValidator = z.object({
		id: z
			.string()
			.nonempty()
			.regex(/^\d+$/, "ID must be a whole number")
			.transform((str) => Number(str)),
	});

	const params = paramsValidator.safeParse(ctx.params);
	if (!params.success) {
		ctx.status = 400;
		ctx.body = createErrorResponse(params.error);
		return { type: "ERROR" };
	}

	return { type: "OK", id: params.data.id };
};

export const restApi = ({ port, todos, logger }: { port: number; todos: Todos; logger: Logger }): void => {
	const server = new Koa();
	const router = new KoaRouter();

	// Middlewares
	server.use(koaBodyParser({ enableTypes: ["json"] }));

	const formatBody = (body: unknown): string => JSON.stringify(body)?.slice(0, 100) ?? "";
	server.use(async (ctx, next) => {
		logger.log(`-> ${ctx.method} ${ctx.url} req ${formatBody(ctx.request.body)}`);
		await next();
		logger.log(`<- ${ctx.method} ${ctx.url} res  ${ctx.status} ${formatBody(ctx.body)}`);
	});

	// Routes
	router.get("/heartbeat", (ctx) => {
		ctx.body = "OK";
	});

	router.get("/", async (ctx) => {
		const data = await todos.getAll();
		ctx.body = data;
	});
	router.delete("/", async (ctx) => {
		await todos.deleteAll();
		ctx.status = 204;
	});
	router.post("/", async (ctx) => {
		const body = z
			.object({
				text: z.string(),
				completed: z.boolean(),
			})
			.safeParse(ctx.request.body);
		if (!body.success) {
			ctx.status = 400;
			ctx.body = createErrorResponse(body.error);
			return;
		}

		let todoWithoutId;
		try {
			todoWithoutId = createTodoWithoutId(body.data.text, body.data.completed);
		} catch (error) {
			if (error instanceof TodoTextTooShort || error instanceof TodoTextTooLong) {
				ctx.status = 400;
				ctx.body = createErrorResponse(error);
				return;
			} else {
				throw error;
			}
		}

		const newTodo = await todos.create(todoWithoutId);
		ctx.body = newTodo;
	});

	router.get("/:id", async (ctx) => {
		const params = validateTodoIdParam(ctx);
		if (params.type === "ERROR") return;

		const todo = await todos.getById(params.id);
		if (todo) {
			ctx.body = todo;
		} else {
			ctx.status = 404;
		}
	});
	router.delete("/:id", async (ctx) => {
		const params = validateTodoIdParam(ctx);
		if (params.type === "ERROR") return;

		const deleted = await todos.deleteById(params.id);
		ctx.status = deleted ? 204 : 404;
	});
	router.patch("/:id", (ctx) => {
		// TODO
		ctx.status = 500;
	});

	server.use(router.routes());
	server.use(router.allowedMethods());

	// Start server
	server.listen(port, () => {
		logger.log(`server running at http://localhost:${port}`);
	});
};
