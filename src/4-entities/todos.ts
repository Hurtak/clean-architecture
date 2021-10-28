import { z } from "zod";

// Core types
export const todoValidator = z
	.object({
		id: z.number(),
		text: z.string().min(1).max(100),
		completed: z.boolean(),
	})
	.strict();
export type Todo = z.infer<typeof todoValidator>;

// Used at the edges of the system
export const todoWithoutIdValidator = todoValidator.omit({ id: true });
export type TodoWithoutId = z.infer<typeof todoWithoutIdValidator>;

export const todoWithoutIdPartialValidator = todoWithoutIdValidator.partial();
export type TodoWithoutIdPartial = z.infer<typeof todoWithoutIdPartialValidator>;
