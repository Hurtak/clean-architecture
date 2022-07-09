import { Logger } from "../../3-use-cases/logger";
import { noop } from "./test-helpers";

export const getLoggerMock = (): Logger => {
	return {
		verbose: noop,
		log: noop,
		warn: noop,
		error: noop,
	};
};
