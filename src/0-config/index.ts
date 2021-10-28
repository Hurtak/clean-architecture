import configLoader from "config";
import { z } from "zod";

const configValidator = z
	.object({
		port: z.number(),
	})
	.strict();

export type Config = z.infer<typeof configValidator>;

export const config = (): Config => {
	const parsedConfig = configValidator.parse(configLoader);
	return parsedConfig;
};
