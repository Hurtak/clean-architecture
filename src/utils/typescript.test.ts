import { describe, expect, test } from "vitest";

import { never } from "./typescript";

describe("typescript", () => {
	describe("never", () => {
		test("throws", () => {
			expect(() => never()).toThrow();
		});
	});
});
