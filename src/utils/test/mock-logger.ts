import { Logger } from "../../2-entry-points/logger";
import { noop } from "./test-helpers";

export const getLoggerMock = (): Logger => {
	return {
		verbose: noop,
		log: noop,
		warn: noop,
		error: noop,
	};
};
