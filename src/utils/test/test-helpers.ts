import { expect } from "vitest";

import { never } from "../typescript";

export const idDoesNotExist = 0;

export const getId: () => number = (() => {
	let id = 1; // make sure id never equals to "idDoesNotExist"
	return () => id++;
})();

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const assertIsDefined = <T>(result: T | undefined): T => {
	expect(result).toBeDefined();
	if (result === undefined) {
		// This should never happen since toBeDefined throws when result is undefined
		return never();
	}

	return result;
};
