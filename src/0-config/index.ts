import configLoader from "config";
import { z } from "zod";

const configValidator = z
	.object({
		port: z.preprocess(Number, z.number().int()),
	})
	.strict();

export type Config = z.infer<typeof configValidator>;

export const config = (): Config => {
	const parsedConfig = configValidator.parse(configLoader.util.toObject());
	return parsedConfig;
};
