import { describe, expect, test } from "vitest";

import { getId, idDoesNotExist } from "./test-helpers";

describe("test helpers", () => {
	describe("getId", () => {
		const iterations = 100;
		test("all ids are different", () => {
			const ids = new Set<number>();
			for (let i = 0; i < iterations; i++) {
				const id = getId();
				expect(ids.has(id)).toBe(false);
				ids.add(id);
			}
		});
		test("all ids are not idDoesNotExist", () => {
			const ids = new Set<number>();
			for (let i = 0; i < iterations; i++) {
				const id = getId();
				ids.add(id);
			}
			expect(ids.has(idDoesNotExist)).toBe(false);
		});
	});
});
